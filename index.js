const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const crypto = require('crypto');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const StudentAdmission = require('./db/AdmissionForm')
const JssOneResult = require('./db/JssOne')
const Schoolfee = require('./db/Schoolfee')
const Teacher = require('./db/Teacher');
const SetTerm = require('./db/SetTerm')
const Contact = require('./db/Contact')
const Payment = require('./db/Payment')
const jwt = require('jsonwebtoken')
const secretKey = 'dbmsc-secret';

const Registration = require('./db/User'); // Import the Registration model
const AdmissionForm = require('./db/AdmissionForm');
const port = process.env.PORT || 10000;




app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Serve your React app (build it first)
// app.use(express.static('client/build'));
require('./db/config')
require('dotenv').config();



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


// const paystackSecretKey = 'sk_test_7aa631dccd5309b333f9996672a70d90b69c0f53';

// // Generate a unique reference for the payment
// function generateReference() {
//   const timestamp = new Date().getTime();
//   const randomString = Math.random().toString(36).substring(2, 10);
//   return `PAY_${timestamp}_${randomString}`;
// }

// Define endpoint for handling payment initiation
// app.post('/api/payments/initiate', async (req, res) => {
//   try {
//       const { name, email, phone, amount } = req.body;

//       // Generate a reference number for the payment
//       const reference = generateReference();

//       // Call Paystack API to initialize payment
//       const paystackResponse = await axios.post(
//           'https://api.paystack.co/transaction/initialize',
//           {
//               email,
//               amount,
//               reference,
//               metadata: {
//                   name,
//                   phone,
//               }
//           },
//           {
//               headers: {
//                   Authorization: `Bearer ${paystackSecretKey}`,
//               },
//           }
//       );

//       // Extract payment initiation URL from Paystack response
//       const paymentInitiationUrl = paystackResponse.data.data.authorization_url;
      
//       // Store the reference in the database
//       const newPayment = new Payment({ reference });
//       await newPayment.save();

//       // Return the payment initiation URL and reference number to the client
//       res.json({ paymentInitiationUrl, reference });
//   } catch (error) {
//       console.error('Error initiating payment:', error.response?.data || error.message);
//       res.status(500).json({ error: 'Failed to initiate payment' });
//   }
// });

// // Define endpoint for handling Paystack callback
// app.post('/api/payments/callback', (req, res) => {
//   try {
//       const { event, data, signature } = req.body;

//       // Verify Paystack callback using your secret key
//       const isValidCallback = verifyPaystackCallback(event, data, signature);

//       if (isValidCallback) {
//           // Process the callback data (update database, send confirmation, etc.)
//           console.log('Payment callback received:', data);

//           // Respond to Paystack to acknowledge receipt of the callback
//           res.status(200).send({ status: 'success' });
//       } else {
//           console.error('Invalid Paystack callback signature');
//           res.status(400).send({ status: 'invalid_signature' });
//       }
//   } catch (error) {
//       console.error('Error handling Paystack callback:', error);
//       res.status(500).send({ status: 'error' });
//   }
// });

// // Verify Paystack callback using your secret key
// function verifyPaystackCallback(event, data, signature) {
//   try {
//       const concatenatedString = event + JSON.stringify(data);
//       const hash = crypto
//           .createHmac('sha512', paystackSecretKey)
//           .update(concatenatedString)
//           .digest('hex');
//       return hash === signature;
//   } catch (error) {
//       console.error('Error verifying Paystack callback:', error);
//       return false;
//   }
// }

// Endpoint to handle payment success
// app.post('/api/payments/success', async (req, res) => {
//   try {
//       const { reference } = req.body;

//       // Find the payment in the database by reference
//       const payment = await Payment.findOne({ reference });

//       // Update payment status to 'success'
//       payment.status = 'success';
//       await payment.save();

//       // Respond to acknowledge receipt of the success notification
//       res.status(200).send('Payment successful');
//   } catch (error) {
//       console.error('Error handling payment success:', error);
//       res.status(500).json({ error: 'Failed to handle payment success' });
//   }
// });

// Endpoint to check payment status by reference
// app.get('/api/payments/status/:reference', async (req, res) => {
//   try {
//       // Extract payment reference from request parameters
//       const { reference } = req.params;

//       // Find the payment in the database by reference
//       const payment = await Payment.findOne({ reference });

//       // Check if payment exists
//       if (!payment) {
//           return res.status(404).json({ error: 'Payment not found' });
//       }

//       // Respond with the payment status
//       res.json({ status: payment.status });
//   } catch (error) {
//       console.error('Error checking payment status:', error);
//       res.status(500).json({ error: 'Failed to check payment status' });
//   }
// });
app.post('/api/paymentreference', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({ message: 'Payment reference saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/save-results', async (req, res) => {
  try {
    const {term, selectedClass, results } = req.body;
    const newResult = new JssOneResult({term, selectedClass, results });
    await newResult.save();
    res.status(201).send('Results saved successfully');
  } catch (error) {
    console.error('Error saving results:', error);
    res.status(500).send('Internal server error');
  }
});

app.post('/api/confirmpayment', async (req, res) => {
  try {
    const { reference, transaction } = req.body;
    const payment = await Payment.findOne({ reference, transaction });

    if (payment) {
      const token = jwt.sign({ email: payment.reference, userId: payment.id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: 'Reference and transaction id confirmed',  token: token});
    } else {
      res.status(401).json({ message: 'Invalid reference or transaction Id' });
    }
  } catch (error) {
    console.error('Error during comfirmation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/adminlogin', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the array
  const user = users.find((user) => user.email === email);

  if (user && user.password === password) {
    // Authentication successful

    // Generate a token with user information
    const token = jwt.sign({ email: user.email, userId: user.id }, secretKey, { expiresIn: '1h' });

    // Include the token in the response
    res.status(200).json({ message: 'Login successful', token: token });
  } else {
    // Authentication failed
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.post('/api/studentadmissionform', async (req, res) => {
  try {
    const student = new StudentAdmission(req.body);
    await student.save();
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/schoolfee', async (req, res) => {
  try {
    const registration = new Schoolfee(req.body);
    await registration.save();
    res.status(201).json({ message: 'School fees updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { surname, admission } = req.body;
    const user = await Registration.findOne({ surname, admission });

    if (user) {
      const token = jwt.sign({ email: user.email, userId: user.id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token: token });
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
      const token = jwt.sign({ email: user.email, userId: user.id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token: token });
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

app.post('/api/contact', async (req, res) => {
  const newContact = new Contact(req.body);

  try {
    await newContact.save();
    res.json({ success: true, message: 'contact message sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error sending contact message' });
  }
});

app.get('/api/studentsresults/:term/:selectedClass', async (req, res) => {
  try {
  
     // Extract the value from the request parameters
     const term = req.params.term;
     const selectedClass = req.params.selectedClass;

     // Find documents where the value at index 0 in the results array matches the provided value
     const results = await JssOneResult.find({term: term, selectedClass: selectedClass });
 
     if (!results) {
       // If no matching documents found, send a 404 error response
       return res.status(404).json({ error: 'results not found' });
     }
 
     // Send the matching documents as response
     res.status(200).json({ results });
   } catch (error) {
     // Handle errors
     console.error('Error fetching JSS One results:', error);
     res.status(500).json({ error: 'Failed to fetch JSS One results' });
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
    console.error('Error fetching student by class:', error);
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
    if (department === 'Science' || department === 'Art' || department === 'Commercial') {
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

app.get('/api/searchteachers/search', async (req, res) => {
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

app.get('/api/searchstudents/search', async (req, res) => {
  const { keyword } = req.query;

  try {
    const students = await Registration.find({ surname: { $regex: keyword, $options: 'i' } }); // Case-insensitive search
    if (!students) {
      return res.status(404).json({ message: 'students not found' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/getContact', async (req, res) => {
  try {
    const contactMessages = await Contact.find();
    res.json({ success: true, messages: contactMessages });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving contact messages' });
  }
});

app.get('/api/getAllAdmission', async (req, res) => {
  try {
    
    const admission = await AdmissionForm.find();

    if (!admission) {
      return res.status(404).json({ message: 'Admission Form not found' });
    }

    res.status(200).json(admission);
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

app.put('/api/updateNewSchoolFees', async (req, res) => {
  try {
    const { jssGeneral, jssThree, sssGeneral, sssThree } = req.body;

    // Update all documents in the collection with the provided values
    await Schoolfee.updateMany({}, { jssGeneral, jssThree, sssGeneral, sssThree });

    res.status(200).json({ message: 'School fees updated successfully' });
  } catch (error) {
    console.error('Error updating school fees:', error);
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
app.put('/api/updateadminpassword', (req, res) => {
  const { email, newPassword } = req.body;

  // Check if the user exists in the array
  const user = users.find((user) => user.email === email);

  if (user) {
    // Update only the password
    user.password = newPassword;

    res.status(200).json({ message: 'Password updated successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.put('/api/updateTerm', async (req, res) => {
  try {
    const { session, term } = req.body;

    // Update all documents in the collection with the provided values
    await SetTerm.updateMany({}, { session, term });

    res.status(200).json({ message: 'Term updated successfully' });
  } catch (error) {
    console.error('Error updating Term:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/registration/update-amount', async (req, res) => {
  const { admission, surname, amount } = req.body;

  try {
      // Find the document by admission and surname and update the amount field
      const updatedRegistration = await Registration.findOneAndUpdate(
          { admission, surname },
          { $set: { amount } },
          { new: true }
      );

      if (!updatedRegistration) {
          return res.status(404).json({ error: 'student not found' });
      }

      return res.json(updatedRegistration);
  } catch (error) {
      console.error('Error updating amount:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/deleteteachers/:id', async (req, res) => {
  const teacherId = req.params.id;

  try {
    // Use the Contact model to find and remove the contact message by ID
    const deletedTeacher = await Contact.findByIdAndRemove(teacherId);

    if (deletedTeacher) {
      res.json({ success: true, message: 'Teacher deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Teacher not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting contact teacher' });
  }
});

app.delete('/api/deletestudents/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    // Use the Contact model to find and remove the contact message by ID
    const deletedStudent = await Contact.findByIdAndRemove(studentId);

    if (deletedStudent) {
      res.json({ success: true, message: 'Student deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting contact student' });
  }
});
// Add this route to handle DELETE requests for deleting a contact message by ID
app.delete('/api/deletecontact/:id', async (req, res) => {
  const contactId = req.params.id;

  try {
    // Use the Contact model to find and remove the contact message by ID
    const deletedContact = await Contact.findByIdAndRemove(contactId);

    if (deletedContact) {
      res.json({ success: true, message: 'Contact message deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Contact message not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting contact message' });
  }
});

app.delete('/api/deleteAdmissionForm/:id', async (req, res) => {
  const admissionId = req.params.id;

  try {
    // Use the Contact model to find and remove the contact message by ID
    const deletedAdmission = await AdmissionForm.findByIdAndRemove(admissionId);

    if (deletedAdmission) {
      res.json({ success: true, message: 'Admission Form deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Admission Form not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting contact message' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});