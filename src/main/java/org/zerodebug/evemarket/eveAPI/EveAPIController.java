package org.zerodebug.evemarket.eveAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/orders")
public class EveAPIController {
    EveAPIService eveAPIService;
    @Autowired
    public EveAPIController(EveAPIService eveAPIService) {
        this.eveAPIService = eveAPIService;
    }
    List<String> test = new ArrayList<>(Arrays.asList(("duration,is_buy_order,issued,location_id,min_volume,price," +
            "system_id,volume_remain,volume_total").split(",")));
    @GetMapping("{region_id}/{type_id}")
    public Mono<String> getOrders(@PathVariable String region_id, @PathVariable String type_id) {
        return eveAPIService.getOrders(region_id, type_id)
                .flatMap(order->eveAPIService.readJson(order,test));
    }
    @GetMapping("/{item_id}")
    public Flux<String> getItemPrices(@PathVariable String item_id){
        return eveAPIService.getItemPrices(item_id).flatMap(price->eveAPIService.readJson(price,test));
    }
}
