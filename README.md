### Product Overview

A web application that:

1. Tracks student programming progress on Codeforces
2. Visualizes contest history and problem-solving statistics
3. Detects inactivity and sends reminders
4. Provides insights through charts and analytics

### Key Features:

1. Real-time Codeforces data synchronization
2. Contest performance tracking
3. Inactivity monitoring
4. Problem-solving analytics

### System Architecture

Frontend (React) → Backend (Node.js/Express) → Codeforces API
                    ↓
                MongoDB Database


### API Documentation

Base Url - http://localhost:5000/api

### Student Endpoints

Endpoints 	                 Method	      Description	

/students	                  GET	     List all students	         
/students	                  POST	     Add new student	    
/students/:id	              GET	     Get student profile	     
/students/:id	              PUT	     Update student	        
/students/delete/:id	      DELETE	 Remove student	             
/students/download/csv	      GET	     Export to CSV
/students/:id/email-reminders PUT 	     Update email reminder settings    

### Codeforces Endpoints

Endpoint	               Method	       Description	

/codeforces/:id/contests	GET	         Get contest history	
/codeforces/:id/problems	GET	         Get problem stats	
/codeforces/sync-schedule	PUT	         Update sync schedule	
/codeforces/sync-now	    POST	     Trigger manual sync

### Data Models

## Student
{
  name: String,
  email: String,
  phone: String,
  codeforcesHandle: String,
  currentRating: Number,
  maxRating: Number,
  lastUpdated: Date,
  emailRemindersEnabled: Boolean,
  reminderCount: Number,
  lastActivityDate: Date
}

## CodeforcesData

{
  student: ObjectId,
  contestHistory: [{
    contestId: Number,
    contestName: String,
    rank: Number,
    ratingChange: Number,
    oldRating: Number,
    newRating: Number,
    date: Date
  }],
  problemsSolved: [{
    contestId: Number,
    problemIndex: String,
    problemName: String,
    problemRating: Number,
    submissionDate: Date
  }],
  submissionHeatmap: [{
    date: Date,
    count: Number
  }]
}
