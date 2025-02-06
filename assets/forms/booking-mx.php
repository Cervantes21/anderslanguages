<?php 
// if the url field is empty 
if(isset($_POST['url']) && $_POST['url'] == ''){

     // put your email address here     
     $youremail = 'bp@anderslanguages.com';

          $subject = "**EN* BOOKING CUERNAVACA *** Spanish immersion: your booking"; 
     
     
     // prepare a "pretty" version of the message
     $body = "This is the form that was just submitted:
     
---- BOOKING ----

$_POST[startdate]*$_POST[startdate]*$_POST[firstname]*$_POST[lastname]*$_POST[dob]*$_POST[cell]*ES*$_POST[program]$_POST[schedule]*$_POST[instructor]*$_POST[room]*$_POST[extranight]*$_POST[duration]*$_POST[business]*$_POST[cultural]*$_POST[fiestas]*$_POST[gastronomic]*$_POST[golf]*-*-*-*-*-*-*$_POST[meetgreet]*-*$_POST[comment]*$_POST[email]*https://www.anderslanguages.com/guest/$_POST[firstname]$_POST[lastname]

---- DBASE ----

RESIDENCE
Residence:    CUERNAVACA
Language:    Spanish

INFORMATION ABOUT THE COURSE PARTICIPANT:
First name:    $_POST[firstname]
Last name:    $_POST[lastname]
DOB:    $_POST[dob]
Citizenship:    $_POST[citizenship]
Full address:    $_POST[address]
Email:    $_POST[email]
Email (check):    $_POST[remail]
Mobile:    $_POST[cell]
Mobile (check):    $_POST[recell]
Second guest:    $_POST[second]

ABOUT THE COURSE
Program:    $_POST[program]
Schedule:    $_POST[schedule]
Second instructor:    $_POST[instructor]
Duration:    $_POST[duration]
Start date:    $_POST[startdate]
Alternative date:    $_POST[altdate]

ACCOMMODATION
Room:    $_POST[room]
Extra night:    $_POST[extranight]

EXPERIENCES
Business:    $_POST[business]
Cultural:    $_POST[cultural]
Fiestas:    $_POST[fiestas]
Gastronomic:    $_POST[gastronomic]
Golf:    $_POST[golf]
Luxury:   -

PREMIUM SERVICES
Meet & greet:    $_POST[meetgreet]

COMMENT
Comment guest:    $_POST[comment]

BILLING
Bill paid by:    $_POST[bill]
Name of your employer or business:    $_POST[company]

I confirm that I agree with the terms and conditions:    $_POST[agree]

First and last name:

$_POST[firstname] $_POST[lastname]"; 

     // Use the submitters email if they supplied one     
     // (and it isn't trying to hack your form).     
     // Otherwise send from your email address.     

     if( $_POST['email'] && !preg_match( "/[\r\n]/", $_POST['email']) ) {
         $headers = "From: bp@anderslanguages.com, $_POST[email]";   
     } else {
         $headers = "From: $youremail"; 
     }

     // finally, send the message     
     mail($youremail, $subject, $body, $headers ); } // otherwise, let the spammer think that they got their message through
     
     header('Location: ../../en/thankyou-bookings.html');
exit('Redirecting you to ../../en/thankyou-bookings.html');
     
     
     ?>