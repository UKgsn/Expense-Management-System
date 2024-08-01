const express = require('express');
const mysql = require('./sqlConnection').con;
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const { con } = require('./sqlConnection');
const { getMaxListeners } = require('process');
const bcrypt = require('bcrypt');
dotenv.config();

const alert = require('alert');
    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
   
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
// forgot pass
app.get('/forgot_password', (req, res) =>{
    res.render("forgot_password");
}); 
// forgot pass post   
app.post('/forgot_password', async (req, res) => {
    const { email, newpassword } = req.body;

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newpassword, 10);

    // Update the password in the database
    const query = 'UPDATE USER SET USER_PASSWORD = ? WHERE USER_EMAIL = ?';
    connection.query(query, [hashedPassword, email], (err, results) => {
        if (err) {
            console.error('Error updating password:', err);
            return res.status(500).send('Internal server error');
        } 
        console.log('Password updated successfully');
        res.send('Password updated successfully'); 
    });  
});

//Admin Login Page
app.get('/', (req, res) =>{ 
    res.render("home");
});  
 
app.get('/login', (req, res) =>{ 
    res.render("login");
}); 
app.post('/admin_dashboard', (req, res) =>{ 
    res.render("admin_dashboard");
});  
app.get('/add_student', (req, res) =>{ 
    res.render("add_student");
}); 
app.get('/newAdmin', (req, res) =>{ 
    res.render("newAdmin");
}); 


app.post('/', (req, res) =>{
    const admin = req.body.email;
    const password = req.body.password;
    // if (admin === "sam@gmail.com" && password === "sam@123") {
        var query = "select * from USER WHERE ADMIN_EMAIL = ?";
        data = [admin, admin];
        var query2 = "SELECT * from TRANSACTIONS WHERE USER_ID = (SELECT USER_ID FROM USER WHERE USER_EMAIL = ?)";
        mysql.query(query, data, (error, result) => {
            if(result.length === 0){
                alert('Invalid Admin Credentials');
                res.redirect('/');
            }
            mysql.query(query2, admin, (error, adminpay) =>{
                res.render("landing", {result, adminpay});
            })
        });
    // }
})

// //student details updation


// app.use(bodyParser.urlencoded({ extended: true }));

// // Route for handling form submission and adding a new student
// app.post('/student', (req, res) => {

//     let rollNumber = req.body.rollNumber;
//     let firstName = req.body.firstName;
//     let lastName = req.body.lastName;
//     let email = req.body.email;
//     let password = req.body.password;

//     // SQL query to insert a new student
//     const sql = 'INSERT INTO students (rollNumber, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)';
//     const values = [rollNumber, firstName, lastName, email, password];

//     // Execute the SQL query
//     connection.query(sql, values, (err, result) => {
//         if (err) {
//             console.error('Error adding student:', err);
//             return res.status(500).send('Failed to add student. Please try again.');
//         }

//         console.log('Student added successfully:', result);
//         res.status(200).send('Student added successfully!');
//     });
// });

  
 

//Admin Registration Page
// app.get('/addAdmin', (req, res) =>{
//     res.render('newAdmin');
// })
 
app.post('/addStudent', (req, res) =>{
    let fname = req.body.firstName; 
    let lname = req.body.lastName;
    let roll = req.body.roll;
    let password;
    if(req.body.password == req.body.confirmPassword){
        password = req.body.password;
    }
    let userEmail = req.body.userEmail; 
    let sql1 = "INSERT INTO USER(ROLL,USER_PASSWORD, FNAME,LNAME, USER_EMAIL) VALUES ?";
    let values1 = [
        [roll,password, fname,lname, userEmail]
    ];

    con.query(sql1, [values1], function(error, result){
        if(error) throw error;
        res.redirect('/admin_dashboard');
    });
});


//User SignUp Page 
app.get('/signup', (req, res) =>{
    res.render("signup")
});

app.post('/signup', (req, res) =>{
    let fname = req.body.firstName;
    let mname = req.body.middleName;
    let lname = req.body.lastName;
    let admin = req.query.admin;
    let password;
    if(req.body.password == req.body.confirmPassword){
        password = req.body.password;
    }
    let userEmail = req.body.userEmail;
    let phoneNumber = req.body.phoneNumber;
    let n = req.body.n;
    let accNumber1 = req.body.accNumber1;
    let accType1 = req.body.accType1;
    let currentBal1 = req.body.currentBal1;
    let accNumber2, accType2, currentBal2;
    if(req.body.accNumber2 != null){
        accNumber2 = req.body.accNumber2;
        accType2 = req.body.accType2;
        currentBal2 = req.body.currentBal2;
    }
    let accNumber3, accType3, currentBal3;
    if(req.body.accNumber3 != null){
        accNumber3 = req.body.accNumber3;
        accType3 = req.body.accType3;
        currentBal3 = req.body.currentBal3;
    }

        let sql1 = "INSERT INTO USER(USER_PASSWORD, FNAME, MNAME, LNAME, USER_EMAIL, USER_PHONE, ADMIN_EMAIL) VALUES ?";

        let values1 = [
            [password, fname, mname, lname, userEmail, phoneNumber, admin]
        ];

        mysql.query(sql1, [values1], function(error, result){
            if(error){
                alert('Fill Appropriate details');
                res.redirect('/signup?admin='+admin);
            }
            else{
            let sql2 = "INSERT INTO ACCOUNT(USER_ID, ACC_NO, ACC_TYPE, ACC_BAL) VALUES ?";
              
            let values2 = [];
            if(n==1){
                values2 = [
                    [result.insertId, accNumber1, accType1, currentBal1]
                ]
            }
            else if(n==2){
            values2 =[
                [result.insertId, accNumber1, accType1, currentBal1],
                [result.insertId, accNumber2, accType2, currentBal2],
            ];
            }
            else if(n==3){
                values2 =[
                    [result.insertId, accNumber1, accType1, currentBal1],
                    [result.insertId, accNumber2, accType2, currentBal2],
                    [result.insertId, accNumber3, accType3, currentBal3],
                ]
            }

            mysql.query(sql2, [values2], function(error, result){
                if(error){
                    alert('Fill Appropriate Details');
                    res.redirect('/signup?admin='+admin);
                };
                res.redirect(301, '/userLogin');
            })
            };
        })
    }); 

    //Admin Landing Page: Where they can see, add and delete users
    app.get('/landing', (req, res) =>{
        let admin = "sam@gmail.com";
        var query = 'select * from USER WHERE USER_EMAIL != ?';
        var query2 = 'SELECT * from TRANSACTIONS WHERE TRANSACTIONS.USER_ID = USER.USER_ID AND USER.USER_EMAIL = ?';
        mysql.query(query, admin, (error, result) => {
            mysql.query(query2, admin, (error, adminpay) =>{
                res.render("landing", {result, adminpay});
            })
        });
    })
    
    app.get('/delete-user',(req,res)=>{
    const id = req.query.id;
    var query = "delete from USER where USER_ID = ?";
    var query2 = "delete from ACCOUNT where USER_ID = (SELECT USER_ID FROM USER WHERE USER_ID = ?)";
    mysql.query(query,[id],(error,result)=>{
        mysql.query(query2, [id], (error, result) =>{
            if(error) throw error;
            alert('Redirecting you to admin login!');
            res.redirect('/');
         })
        })
    })
    
    //User Login
    app.get('/userLogin',(req,res)=>{
    res.render("userlogin");
    })

    //User Landing Page
    app.get('/userlanding',(req,res)=>{
    const {password} = req.query
    var query2 = "select * from USER WHERE USER_PASSWORD = ? AND USER_EMAIL = ?";
    mysql.query(query2, password, (error, result) =>{
        let uid;
        if(result.length === 0 || password != result[0].USER_PASSWORD){
            alert('Invalid User Credentials!');
            res.redirect('/userLogin');
        }
        else{
                res.render('userland')
        } 
    })
})


    //Transaction adding form  

    app.get('/pay_add', (req, res) =>{
        const uid = req.query.uid;
        let sql1 = "SELECT ACC_NO FROM ACCOUNT WHERE USER_ID = ?"
        mysql.query(sql1, uid, (err, result)=> {
            res.render('pay_add', {
                title: 'Transaction form page',
                result
            })
        })
    });  
    app.post('/save', (req, res) => {
        const email = req.body.email;
        const accNo = req.body.accNo;
        const date = req.body.pay_date;
        const amt = req.body.pay_amt;
        const desc = req.body.pay_desc;
        const rec_name = req.body.rec_name;
        const pay_method = req.body.paymentMethod;
        
        let rec_phone;
        let rec_acc;
        let rec_bank;
        let enterprise;
    
        // Determine payment method and recipient details
        if (pay_method == 'enterprise') {
            enterprise = true;
            rec_acc = null;
            rec_phone = null;
            rec_bank = null;
        } else if (pay_method == 'phoneNumber') {
            enterprise = false;
            rec_acc = null;
            rec_phone = req.body.phoneNumber;
            rec_bank = null;
        } else if (pay_method == 'bankAccount') {
            enterprise = false;
            rec_acc = req.body.recAcc;
            rec_phone = null;
            rec_bank = req.body.recBank;
        } else {
            enterprise = false;
            rec_acc = null; 
            rec_phone = null; 
            rec_bank = null; // Reset rec_bank to null
        }
    
        // Retrieve sender's user ID and account ID
        const getUserQuery = 'SELECT * FROM USER WHERE USER_EMAIL = ?';
        mysql.query(getUserQuery, email, (err, userResult) => {
            if (err || userResult.length === 0) {
                console.error('Error retrieving user data:', err);
                return res.status(500).send('Internal server error');
            }
    
            const userId = userResult[0].USER_ID;
    
            // Retrieve sender's account ID
            const getAccountQuery = 'SELECT * FROM ACCOUNT WHERE ACC_NO = ?';
            mysql.query(getAccountQuery, accNo, (err, accResult) => {
                if (err || accResult.length === 0) {
                    console.error('Error retrieving account data:', err);
                    return res.status(500).send('Internal server error');
                }
    
                const accountId = accResult[0].ACC_ID;
    
                // Check if the payment method is 'bankAccount'
                if (pay_method === 'bankAccount') {
                    // Retrieve recipient's account ID
                    const getRecipientAccountQuery = 'SELECT * FROM ACCOUNT WHERE ACC_NO = ?';
                    mysql.query(getRecipientAccountQuery, rec_acc, (err, recipientAccResult) => {
                        if (err || recipientAccResult.length === 0) {
                            console.error('Error retrieving recipient account data:', err);
                            return res.status(500).send('Internal server error');
                        }
    
                        const recipientAccountId = recipientAccResult[0].ACC_ID;
    
                        // Insert transaction data
                        const insertTransactionQuery = 'INSERT INTO TRANSACTIONS (USER_ID, ACC_ID, PAY_AMT, PAY_DATE, PAY_DESC, REC_NAME) VALUES (?, ?, ?, ?, ?, ?)';
                        const transactionData = [userId, accountId, amt, date, desc, rec_name];
                        mysql.query(insertTransactionQuery, transactionData, (err, insertResult) => {
                            if (err) {
                                console.error('Error inserting transaction data:', err);
                                return res.status(500).send('Internal server error');
                            }  
    
                            // Update sender's account balance
                            const updateSenderBalanceQuery = 'UPDATE ACCOUNT SET ACC_BAL = ACC_BAL - ? WHERE ACC_ID = ?';
                            const updateSenderData = [amt, accountId];
                            mysql.query(updateSenderBalanceQuery, updateSenderData, (err, updateSenderResult) => {
                                if (err) {
                                    console.error('Error updating sender account balance:', err);
                                    return res.status(500).send('Internal server error');
                                }
    
                                // Update recipient's account balance
                                const updateRecipientBalanceQuery = 'UPDATE ACCOUNT SET ACC_BAL = ACC_BAL + ? WHERE ACC_ID = ?';
                                const updateRecipientData = [amt, recipientAccountId];
                                mysql.query(updateRecipientBalanceQuery, updateRecipientData, (err, updateRecipientResult) => {
                                    if (err) {
                                        console.error('Error updating recipient account balance:', err);
                                        return res.status(500).send('Internal server error');
                                    }
    
                                    res.redirect('/userland?name=' + email + '&password=' + userResult[0].USER_PASSWORD);
                                });
                            });
                        });
                    });
                } else {
                    
                    // Insert transaction data
                    const insertTransactionQuery = 'INSERT INTO TRANSACTIONS (USER_ID, ACC_ID, PAY_AMT, PAY_DATE, PAY_DESC, REC_NAME) VALUES (?, ?, ?, ?, ?, ?)';
                    const transactionData = [userId, accountId, amt, date, desc, rec_name];
                    mysql.query(insertTransactionQuery, transactionData, (err, insertResult) => {
                        if (err) {
                            console.error('Error inserting transaction data:', err);
                            return res.status(500).send('Internal server error');
                        }  
    
                        // Update sender's account balance
                        const updateSenderBalanceQuery = 'UPDATE ACCOUNT SET ACC_BAL = ACC_BAL - ? WHERE ACC_ID = ?';
                        const updateSenderData = [amt, accountId];
                        mysql.query(updateSenderBalanceQuery, updateSenderData, (err, updateSenderResult) => {
                            if (err) {
                                console.error('Error updating sender account balance:', err);
                                return res.status(500).send('Internal server error');
                            }
    
                            res.redirect('/userland?name=' + email + '&password=' + userResult[0].USER_PASSWORD);
                        });
                    });
                } 
            });
        });
    });
    
     
    
    
    //Adding Money To User Account

    app.get('/addmoney', (req, res)=>{
        const uid = req.query.uid;
        let sql1 = "SELECT * FROM ACCOUNT WHERE USER_ID = ?"
        mysql.query(sql1, uid, (err, account)=> {
            res.render('add_money', {
                title: 'Add Money To Your Account',
                subtitle: '....And Continue making Payments!',
                account
            });
        })
    });

    app.post('/savebal', (req, res) =>{
        const uid = req.query.uid;
        let sql1 = 'SELECT * FROM USER WHERE USER_ID = ?';
        let {accNo, add_desc, addDate} = req.body;
        let addAmt = req.body.addAmt;
        let snd_name = 'FROM '+req.body.snd_name;
        mysql.query(sql1, uid, (err, user)=>{
            email = user[0].USER_EMAIL;
            password = user[0].USER_PASSWORD;
            let sql2 = "SELECT * FROM ACCOUNT WHERE ACC_NO = ?";
            let sql3 = "INSERT INTO TRANSACTIONS(USER_ID, ACC_ID, PAY_AMT, PAY_DATE, PAY_DESC, REC_NAME) VALUES ?"
            
            let sql4 = 'UPDATE ACCOUNT SET ACC_BAL = (ACC_BAL + ?) WHERE ACC_NO = ?';
              
            mysql.query(sql2, accNo, (err, account)=>{
                actid = account[0].ACC_ID;
                let data1 = [
                    [uid, actid, addAmt, addDate, add_desc, snd_name]
                ]
                mysql.query(sql3, [data1], (err, addtran) =>{
                    let data = [addAmt, accNo];
                    mysql.query(sql4, data, (err, addbal)=>{
                        res.redirect('/userland?name='+email+'&password='+password);
                    })
                })
            })
        })
    })

    //Rewards Page

    app.get("/rewards", (req, res) =>{
        const email = req.query.email;
        var query = "SELECT * FROM REWARDS WHERE USER_ID IS NULL";
        var query2 = "SELECT * FROM USER WHERE USER_EMAIL = ?";
        mysql.query(query, (error, result) => {
            mysql.query(query2, email, (err, user) =>{
                uid = user[0].USER_ID;
                let query3 = "SELECT * FROM REWARDS WHERE USER_ID = ?";
                mysql.query(query3, uid, (err, claim)=>{
                    if(claim.length == 0){
                        alert('No rewards claimed yet!')
                        res.render('rewards', {result, user, claim});
                    }
                    else{  
                        res.render('rewards', {result, user, claim})
                    }
                })
            })
        })
    })

    app.get('/claim', (req, res) =>{
    const code = req.query.code;
    const email = req.query.email;
    
    var query = "select * from USER where USER_EMAIL=?";
    var query2 = "update rewards set USER_ID = ? where CODE = ?";
    mysql.query(query,email,(error,result)=>{
        let uid;
        if(result.length === 0 || code === ''){
            alert('Please Enter Code and Email to Claim!')
            res.redirect("/rewards?email="+email);
        }
        else{
            uid = result[0].USER_ID;
            let data = [uid, code];
            mysql.query(query2, data ,(err,result1)=>{
                if(result1.changedRows === 0){
                    alert('Invalid Code!');
                }
                else{
                    alert('Claimed successfully: '+code);
                }
                res.redirect("/rewards?email="+email);
        })}
    })
})

const port = process.env.PORT||3000;
app.listen(port, ()=>{
    console.log(`localhost:${port}`);
});
