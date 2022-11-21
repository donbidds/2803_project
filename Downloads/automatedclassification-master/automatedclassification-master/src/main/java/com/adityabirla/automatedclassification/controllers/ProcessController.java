package com.adityabirla.automatedclassification.controllers;

import com.adityabirla.automatedclassification.dto.LocationDatum;
import com.adityabirla.automatedclassification.dto.ProcessAspect;
import com.adityabirla.automatedclassification.services.LogService;
import com.adityabirla.automatedclassification.services.ProcessService;
import com.google.gson.Gson;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@CrossOrigin
@Controller
@AllArgsConstructor
@RequestMapping("/api/v1")
public class ProcessController {

    private final ProcessService processService;

    private LogService logService;

    private Gson gson;

    @PostMapping("/process")
    public ResponseEntity<List<LocationDatum>> process(
            HttpServletRequest httpServletRequest,
            @RequestHeader Map<String, String> headers,
            @RequestBody List<ProcessAspect> processAspects) throws IOException {
        Instant receivedTime = Instant.now();
        Instant servedTime;
        // if all images have either classes or a saved segmentator
        if (processAspects.stream().noneMatch(processAspect -> processAspect.getClassAspects().isEmpty()
                && processAspect.getSegmentationAspect().getSegmentationFileTarget() == null)) {
            List<LocationDatum> resp = processService.processImagesWithDifferentSegmentator(processAspects);
            servedTime = Instant.now();
            this.logService.logRequest(
                    receivedTime,
                    servedTime,
                    String.valueOf(httpServletRequest.getRequestURL()),
                    httpServletRequest.getMethod(),
                    this.gson.toJson(processAspects),
                    this.gson.toJson(headers),
                    HttpStatus.OK,
                    this.gson.toJson(resp));
            return new ResponseEntity<>(resp, HttpStatus.OK);
        } else { // if only the first image has either classes or a saved segmentator
            List<LocationDatum> resp = processService.processImagesWithSameSegmentator(processAspects);
            servedTime = Instant.now();
            this.logService.logRequest(
                    receivedTime,
                    servedTime,
                    String.valueOf(httpServletRequest.getRequestURL()),
                    httpServletRequest.getMethod(),
                    this.gson.toJson(processAspects),
                    this.gson.toJson(headers),
                    HttpStatus.OK,
                    this.gson.toJson(resp));
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
    }

    @GetMapping("/getMaxHeap")
    public @ResponseBody long get_heap() {
        return ProcessService.getMaxHeap();
    }

    @GetMapping("/getCSV")
    public @ResponseBody String get_csv() {
        System.out.println("CHECKED");
        // call method to get file string
        // return processService.FaiyazCustomCSV();
        return "hello";
    }
}
