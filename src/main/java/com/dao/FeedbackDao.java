package com.dao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.model.Feedback;

@Service
public class FeedbackDao {

    @Autowired
    FeedbackRepository fbRepo;

    public List<Feedback> getAllFeedbacks() {
        return fbRepo.findAll();
    }

    public Feedback getFeedbackByCandidateId(int candidateId) {
        return fbRepo.getFeedbackByCandidateID(candidateId).orElse(null);
    }

    public Feedback addFeedback(Feedback feedback) {
        return fbRepo.save(feedback);
    }

    public Feedback updateFeedback(Feedback feedback) {
        return fbRepo.save(feedback);
    }
}