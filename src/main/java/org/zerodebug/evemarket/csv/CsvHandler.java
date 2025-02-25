package org.zerodebug.evemarket.csv;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CsvHandler {
    public CsvHandler(){
    }
    public String getLocationFromCSV(int id) throws IOException, CsvException {
        CSVReader reader = new CSVReaderBuilder(new FileReader("src/main/resources/staStations.csv")).build();
        List<String[]> myEntries = reader.readAll();
        for(String[] array : myEntries){
            if(array[0].equals(Integer.toString(id))){
                return (array[11]);
            }
        }
        return null;
    }
    public String getSystemFromCSV(int id) throws IOException, CsvException {
        CSVReader reader = new CSVReaderBuilder(new FileReader("src/main/resources/mapSolarSystems.csv")).build();
        List<String[]> myEntries = reader.readAll();
        for(String[] array : myEntries){
            if(array[2].equals(Integer.toString(id))){
                return (array[3]);
            }
        }
        return null;
    }
    public ArrayList<String> getAllRegionsFromCSV(String id) throws IOException, CsvException {
        CSVReader reader = new CSVReaderBuilder(new FileReader("src/main/resources/mapRegions.csv")).build();
        List<String[]> myEntries = reader.readAll();
        myEntries.removeFirst();
        ArrayList<String> answer = new ArrayList<>();
        for(String[] array : myEntries){
            answer.add(array[0]);
        }
        return answer;
    }

    public String getVolumeFromCSV(int id) throws IOException, CsvException {
        CSVReader reader = new CSVReaderBuilder(new FileReader("src/main/resources/invTypes.csv")).build();
        List<String[]> myEntries = reader.readAll();
        for(String[] array : myEntries){
            if(array[0].equals(Integer.toString(id))){
                return (array[5]);
            }
        }
        return null;
    }
}
