package org.zerodebug.evemarket.eveAPI;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class EveAPIService {
    private final WebClient webClient;
    public EveAPIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://esi.evetech.net/latest/markets/").build();
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
}
