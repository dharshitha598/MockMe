package com.dao;


import java.util.Optional;

//import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.model.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
	
	//Feedback getFeedbackByCandidateID = null;

	@Query("from Feedback where candidateId = :Id")
	Optional<Feedback> getFeedbackByCandidateID(@Param("Id") int candidateId);
	
}

