package org.zerodebug.evemarket.csv;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import lombok.Data;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Data
public class CsvHandler {
    private List<String[]> staStations;
    private List<String[]> mapSolarSystem;
    private List<String[]> mapRegions;
    private List<String[]> intTypesCSV;
    public CsvHandler() throws IOException, CsvException {
        CSVReader stations = new CSVReaderBuilder(new FileReader("src/main/resources/staStations.csv")).build();
        staStations = stations.readAll();
        CSVReader solarSystem = new CSVReaderBuilder(new FileReader("src/main/resources/mapSolarSystems.csv")).build();
        mapSolarSystem = solarSystem.readAll();
        CSVReader regions = new CSVReaderBuilder(new FileReader("src/main/resources/mapRegions.csv")).build();
        mapRegions = regions.readAll();
        CSVReader intTypes = new CSVReaderBuilder(new FileReader("src/main/resources/invTypes.csv")).build();
        intTypesCSV = intTypes.readAll();
    }
    public String getLocationFromCSV(int id){
        for(String[] array : staStations){
            if(array[0].equals(Integer.toString(id))){
                return (array[11]);
            }
        }
        return null;
    }
    public String getSystemFromCSV(int id) {
        for(String[] array : mapSolarSystem){
            if(array[2].equals(Integer.toString(id))){
                return (array[3]);
            }
        }
        return null;
    }
    public ArrayList<String> getAllRegionsFromCSV(){
        ArrayList<String> answer = new ArrayList<>();
        for(String[] array : mapRegions){
            answer.add(array[0]);
        }
        return answer;
    }

    public String getVolumeFromCSV(int id){
        for(String[] array : intTypesCSV){
            if(array[0].equals(Integer.toString(id))){
                return (array[5]);
            }
        }
        return null;
    }
}
