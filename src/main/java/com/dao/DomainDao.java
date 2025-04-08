package com.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.model.Domain;

@Service
public class DomainDao {
    @Autowired
    DomainRepository domainRepo;

	public List<Domain> getAllDomains() {
		return domainRepo.findAll();
	}

	public Domain addDomain(Domain d) {
		return domainRepo.save(d);
	}
}
