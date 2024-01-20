const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Schoolfee = require('./db/Schoolfee')
const Teacher = require('./db/Teacher');
const SetTerm = require('./db/SetTerm')

const Registration = require('./db/User'); // Import the Registration model
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// Serve your React app (build it first)
// app.use(express.static('client/build'));
require('./db/config')



class JSSClass {
  constructor() {
    this.className = 'JSS';
    this.subjects = ['Mathematics', 'English Studies', 'Basic Science', 'Basic Technology', 'Civic Education', 
                      'Agricultural Science', 'Computer Science', 'Physical Education', 'Business Studies', 'Social Studies',
                      'CRK', 'CCA', 'Home Economics', 'Literature-in-English', 'History', 'Yoruba', 'French'
                    ];
  }
}

class ArtClass {
  constructor() {
    this.className = 'Art';
    this.subjects = ['Mathematics', 'English Studies', 'Civic Education', 'Economics', 'Biology', 'Government', 'Fine Arts',
                     'Literature-in-English', 'History', 'Christain Religious Studies','Yoruba', 'French'
                    ];
  }
}

class ScienceClass {
  constructor() {
    this.className = 'Science';
    this.subjects = ['Mathematics',  'English Studies', 'Civic Education', 'Economics', 'Physics', 'Chemistry', 'Biology', 
                      'Agricultural Science', 'Geography', 'Further Mathematics', 'Computer Science', 'Yoruba'
                    ];
  }
}

class CommercialClass {
  constructor() {
    this.className = 'Commercial';
    this.subjects = ['Mathematics',  'English Studies', 'Civic Education', 'Economics','Biology', 'Commerce', 'Accounting', 'Business Studies', 
                     'Marketing', 'Food and Nutrition'];
  }
}

const classesArray = [
  new JSSClass(),
  new ArtClass(),
  new ScienceClass(),
  new CommercialClass(),
];


let users = [
  { email: 'divineblossom999@gmail.com', password: 'admin001' },
  // Add more users as needed
];

app.post('/api/adminlogin', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the array
  const user = users.find((user) => user.email === email);

  if (user && user.password === password) {
    // Authentication successful
    res.status(200).json({ message: 'Login successful' });
  } else {
    // Authentication failed
    res.status(401).json({ message: 'Invalid email or password' });
  }
});



app.post('/api/register', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/schoolfee', async (req, res) => {
  try {
    const registration = new Schoolfee(req.body);
    await registration.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { surname, admission } = req.body;
    const user = await Registration.findOne({ surname, admission });

    if (user) {
      res.status(200).json({ message: 'Sign-in successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/teacherSignIn', async (req, res) => {
  try {
    const { email, teacherId } = req.body;
    const user = await Teacher.findOne({ email, teacherId });

    if (user) {
      res.status(200).json({ message: 'Sign-in successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/teachers', async (req, res) => {
  const newTeacher = new Teacher(req.body);

  try {
    await newTeacher.save();
    res.json({ success: true, message: 'Teacher registered successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error registering teacher' });
  }
});

app.post('/api/set-terms', async (req, res) => {
  const { session, term } = req.body;

  try {
    const newSetTerm = new SetTerm({ session, term });
    await newSetTerm.save();
    res.json({ success: true, message: 'Term set successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error setting term' });
  }
});


app.get('/api/getSubjects/:className', (req, res) => {
  const className = req.params.className;

  // Find the class by name
  const targetClass = classesArray.find((cls) => cls.className.toLowerCase() === className.toLowerCase());

  if (targetClass) {
    res.json({ success: true, subjects: targetClass.subjects });
  } else {
    res.status(404).json({ success: false, message: 'Class not found' });
  }
});

app.get('/api/student/:surname/:admission', async (req, res) => {
  try {
    const surname = req.params.surname;
    const admission = req.params.admission;
    const registration = await Registration.findOne({ surname: surname, admission: admission });

    if (!registration) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(registration);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/teachers/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const teacher = await Teacher.findOne({ name });

    if (!teacher) {
      return res.status(404).json({ message: 'teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching teacher by Id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/teachers/:email/:teacherId', async (req, res) => {
  try {
    const email = req.params.email;
    const teacherId = req.params.teacherId;
    const teacher = await Teacher.findOne({ email: email,  teacherId: teacherId});

    if (!teacher) {
      return res.status(404).json({ message: 'teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching teacher by Id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/getstudents/:surname/:firstname', async (req, res) => {
  try {
    const surname = req.params.surname;
    const firstname = req.params.firstname;
    const student = await Registration.findOne({ surname: surname, firstname: firstname });

    if (!student) {
      return res.status(404).json({ message: 'student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student by Id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

app.get('/api/getMyStudents/:class', async (req, res) => {
  try {
    const studentClass = req.params.class;
 
    const student = await Registration.find({ class: studentClass });

    if (!student) {
      return res.status(404).json({ message: 'student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student by Id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/studentSchoolfee', async (req, res) => {
  try {
    
    const fees = await Schoolfee.find();

    if (!fees) {
      return res.status(404).json({ message: 'fees not found' });
    }

    res.status(200).json(fees);
  } catch (error) {
    console.error('Error fetching school fees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/getTeachers', async (req, res) => {
  try {
    
    const teacher = await Teacher.find();

    if (!teacher) {
      return res.status(404).json({ message: 'teachers not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/classteachers/:classAssigned', async (req, res) => {
  try {
    const classAssigned = req.params.classAssigned;
    const teacher = await Teacher.findOne({ classAssigned: classAssigned });

    if (!teacher) {
      return res.status(404).json({ message: 'class teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching class teacher by Id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/departmentteachers/:department', async (req, res) => {
  const department = req.params.department

  try {
   
    let query = {};
    if (department === 'Science' || department === 'Art') {
      query = { $or: [{ departmentAssinged: 'Sss General' }, { departmentAssinged: department }] };
    } else {
      query = { departmentAssinged: department };
    }

  
   
    const teacher = await Teacher.find(query);
   

    if (!teacher) {
      return res.status(404).json({ message: 'Department teachers not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching department teachers by Id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/teachers/search', async (req, res) => {
  const { keyword } = req.query;

  try {
    const teachers = await Teacher.find({ name: { $regex: keyword, $options: 'i' } }); // Case-insensitive search
    if (!teachers) {
      return res.status(404).json({ message: 'teachers not found' });
    }

    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/students/search', async (req, res) => {
  const { keyword } = req.query;

  try {
    const students = await Registration.find({ name: { $regex: keyword, $options: 'i' } }); // Case-insensitive search
    if (!students) {
      return res.status(404).json({ message: 'students not found' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/getStudent', async (req, res) => {
  try {
    
    const student = await Registration.find();

    if (!student) {
      return res.status(404).json({ message: 'students not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/term', async (req, res) => {
  try {
    
    const term = await SetTerm.find();

    if (!term ) {
      return res.status(404).json({ message: 'term not found' });
    }

    res.status(200).json(term);
  } catch (error) {
    console.error('Error fetching term:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateStudent', async (req, res) => {
  try {
    const { jssGeneral, jssThree, sssGeneral, sssThree } = req.body;

    // Update all documents in the collection with the provided values
    await Schoolfee.updateMany({}, { jssGeneral, jssThree, sssGeneral, sssThree });

    res.status(200).json({ message: 'All data updated successfully' });
  } catch (error) {
    console.error('Error updating all data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.put('/api/updateTeacher/:name', async (req, res) => {
  const teacherName = req.params.name;

  try {
    const updatedTeacher = await Teacher.findOneAndUpdate(
      { name: teacherName },
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedTeacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, teacher: updatedTeacher });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error updating teacher' });
  }
});

app.put('/api/updateStudent/:surname/:firstname', async (req, res) => {
  const surname = req.params.surname;
    const firstname = req.params.firstname;

  try {
    const updatedStudent = await Registration.findOneAndUpdate(
      { surname: surname, firstname: firstname },
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error updating student' });
  }
});

app.put('/api/updateTerm', async (req, res) => {
  try {
    const { session, term } = req.body;

    // Update all documents in the collection with the provided values
    await SetTerm.updateMany({}, { session, term });

    res.status(200).json({ message: 'All data updated successfully' });
  } catch (error) {
    console.error('Error updating all data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/deleteteachers/:name', async (req, res) => {
  const name = req.params.name;

  try {
    const deletedTeacher = await Teacher.findOneAndDelete({ name: name });

    if (!deletedTeacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting teacher' });
  }
});

app.delete('/api/deletestudents/:firstname/:surname', async (req, res) => {
  const firstname = req.params.firstname;
  const surname = req.params.surname;

  

  try {
    const deletedStudent = await Registration.findOneAndDelete({ firstname: firstname, surname: surname });

    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting student' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});