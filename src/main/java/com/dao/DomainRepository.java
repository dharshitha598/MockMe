package com.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.model.Domain;

@Repository
public interface DomainRepository extends JpaRepository<Domain, Integer> {
	
}


