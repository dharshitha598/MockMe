package com.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RestController;

import com.dao.FeedbackDao;
import com.model.Feedback;

@RestController
public class FeedbackController {
	

	@Autowired
	FeedbackDao fbDao;
	
	@GetMapping("getAllFeedbacks")
	public List<Feedback> getAllFeedbacks() {
	    return fbDao.getAllFeedbacks();
	}
	
	/* @GetMapping("getFeedbackById/{id}")
	public Feedback getFeedbackById(@PathVariable("id") int candidateId) {		
		return fbDao.getFeedbackById(candidateId);
	} */
	
	@GetMapping("getFeedbackById/{id}")
	public Feedback getFeedbackById(@PathVariable("id") int candidateId) {
		//return fbDao.getFeedbackById(987654);
		return fbDao.getFeedbackByCandidateId(candidateId);
	}
	
	@PostMapping("addFeedback")
	public Feedback addFeedback(@RequestBody Feedback fb) {
		
		return fbDao.addFeedback(fb);
	}
	
	@PutMapping("updateFeedback")
	public Feedback updateFeedback(@RequestBody Feedback fb) {
		return fbDao.updateFeedback(fb);
	}
}
