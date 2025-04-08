package com.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dao.DomainDao;
import com.model.Domain;

@RestController
public class DomainController {
	@Autowired
	DomainDao domainDao;
	
	@GetMapping("getAllDomains")
	public List<Domain> getAllDomains() {
		return domainDao.getAllDomains();
	}
	
	@PostMapping("addDomain")
	public Domain addDomain(@RequestBody Domain d) {
		return domainDao.addDomain(d);
	}
	
}
