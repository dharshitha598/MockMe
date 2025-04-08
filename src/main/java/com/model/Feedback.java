package com.model;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "feedback")
public class Feedback implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "FeedbackID")
    private int feedbackId;

    @Column(name = "CandidateID")
    private int candidateId;
    
    @Column(name = "Comments")
    private String comments;

    @Column(name = "Rating")
    private int rating;

    @Column(name = "CreateDate")
    private Date createDate;

    @Column(name = "UpdateDate")
    private Date updateDate;


    //@ManyToOne
    //@JoinColumn(name = "domainid", referencedColumnName = "domainid")
    //private int domainid;

    //@Column(name = "domainid")
    //@Column(insertable=false, updatable=false)
    //private int domainid;
    
    @ManyToOne
	@JoinColumn(name="domainid") //, nullable = false)
	private Domain domain;
    
	// Getters and Setters
    public int getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(int feedbackId) {
        this.feedbackId = feedbackId;
    }

    public int getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(int candidateId) {
        this.candidateId = candidateId;
    }

    public Domain getDomain() {
		return domain;
	}

    public void setDomain(Domain domain) {
		this.domain = domain;
	}

    
    //public int getdomainid() {
    	//return domain.getDomainId();
    //}

    //public void setdomainid(int domainid) {
    	//this.domainid = domainid;
    //}
    
       

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
    
}
