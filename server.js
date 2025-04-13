const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sijjusql',
  database: 'mockmeproject',
  dateStrings: true
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// Nodemailer Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mockme.team@gmail.com",
    pass: "nudy grtr tqnk svay",
  },
});

const facultyEmails = [
  "mockme.interviewer@gmail.com",
  "mockme.interviewer@gmail.com",
  "mockme.interviewer@gmail.com"
];

function getRandomFacultyEmail() {
  return facultyEmails[Math.floor(Math.random() * facultyEmails.length)];
}

function sendMeetingEmails(userEmail, meetingDate, meetingTime) {
  const facultyEmail = getRandomFacultyEmail();
  const googleMeetLink = "https://meet.google.com/qss-cqcu-tkn";

  const userMailOptions = {
    from: "mockme.team@gmail.com",
    to: userEmail,
    subject: "Meeting Scheduled Confirmation",
    text: `Dear User,

Your meeting has been successfully scheduled.

Details:
Date: ${meetingDate}
Time: ${meetingTime}
Google Meet Link: ${googleMeetLink}

Thank you,
MockMe Team`
  };

  const facultyMailOptions = {
    from: "mockme.team@gmail.com",
    to: facultyEmail,
    subject: "New Meeting Scheduled",
    text: `Dear Faculty,

A new meeting has been scheduled.

Details:
Date: ${meetingDate}
Time: ${meetingTime}
Google Meet Link: ${googleMeetLink}
User: ${userEmail}

Thank you,
MockMe Team`
  };

  transporter.sendMail(userMailOptions, (err, info) => {
    if (err) return console.error("User mail error:", err);
    console.log("User email sent:", info.response);
  });

  transporter.sendMail(facultyMailOptions, (err, info) => {
    if (err) return console.error("Faculty mail error:", err);
    console.log("Faculty email sent:", info.response);
  });
}

// Signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists.' });
        }
        return res.status(500).json({ message: 'Database error.' });
      }
      res.status(200).json({ message: 'Signup successful!' });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Internal server error.' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    res.status(200).json({ message: 'Login successful!' });
  });
});

// Google Sign-In
const googleClient = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: "YOUR_GOOGLE_CLIENT_ID",
    });
    const { email, name } = ticket.getPayload();

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).json({ success: false });

      if (results.length === 0) {
        db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, null], (err) => {
          if (err) return res.status(500).json({ success: false });
          res.status(200).json({ success: true });
        });
      } else {
        res.status(200).json({ success: true });
      }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Schedule Meeting
app.post('/api/schedule-meeting', (req, res) => {
  const { userEmail, meetingDate, meetingTime } = req.body;

  if (!(userEmail && meetingDate && meetingTime)) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const facultyEmail = getRandomFacultyEmail();
  const link = "https://meet.google.com/qss-cqcu-tkn";

  const query = 'INSERT INTO meetings (user_email, faculty_email, meeting_date, meeting_time, meet_link) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [userEmail, facultyEmail, meetingDate, meetingTime, link], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to save meeting.' });

    sendMeetingEmails(userEmail, meetingDate, meetingTime);
    res.status(200).json({ message: 'Meeting scheduled successfully.' });
  });
});

// Fetch Meetings by Email
app.get('/api/meetings', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const query = 'SELECT meeting_date, meeting_time, faculty_email FROM meetings WHERE user_email = ? ORDER BY meeting_date, meeting_time';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching meetings' });

    const now = new Date();

    const meetings = results.map(meeting => {
      const meetingDateTime = new Date(`${meeting.meeting_date}T${meeting.meeting_time}`);
      return {
        ...meeting,
        status: meetingDateTime < now ? 'past' : 'upcoming',
        formattedDate: new Date(meeting.meeting_date).toLocaleDateString(),
        formattedTime: new Date(`1970-01-01T${meeting.meeting_time}`).toLocaleTimeString(),
        domain: meeting.faculty_email.split('@')[1],
      };
    });

    res.status(200).json(meetings);
  });
});

// Fetch Interviews Meetings history by Email
app.get('/interviewsHistory', (req, res) => {
  const email = req.query.email;  

  if (!email) return res.status(400).json({ message: 'Email is required' });
    db.query("SELECT meeting_date, meeting_time, faculty_email FROM meetings WHERE user_email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });

    //const now = new Date();
    const past = [];
    const upcoming = [];

    const now = new Date();

    results.forEach(({ meeting_date, meeting_time }) => {
    
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const localToday = `${yyyy}-${mm}-${dd}`;
    console.log("Today:", localToday);

    if (meeting_date < localToday) {
        console.log("It's a past interview.");
        past.push({ meeting_date, meeting_time });
      } else {
        console.log("It's an upcoming interview.");
        upcoming.push({ meeting_date, meeting_time });
      }

    });
    
    res.json({ pastInterviews: past, upcomingInterviews: upcoming });
  });

}); 

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
