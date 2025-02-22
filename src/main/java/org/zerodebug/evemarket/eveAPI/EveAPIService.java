package org.zerodebug.evemarket.eveAPI;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EveAPIService {
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public EveAPIService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://esi.evetech.net/latest/markets/").build();
        this.objectMapper = objectMapper;
    }
    public Mono<String> getOrders(String region_id, String type_id) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("{region_id}/orders/")
                        .queryParam("datasource", "tranquility")
                        .queryParam("order_type", "all")
                        .queryParam("page",1)
                        .queryParam("type_id",type_id)
                        .build(region_id)
                )
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> readJson(String json, List<String> keys) {
        return Mono.fromSupplier(()->{
            try {
                JsonNode node = new ObjectMapper().readTree(json);
                List<Map<String, String>> result = new ArrayList<>();
                for(JsonNode jsonNode: node) {
                    Map<String,String> map = new HashMap<>();
                    for (String key : keys) {
                        JsonNode value = jsonNode.path(key);
                        map.put(key, value.isMissingNode() ? null : value.asText());
                    }
                    result.add(map);
                }
                return objectMapper.writeValueAsString(result);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });
    }
}