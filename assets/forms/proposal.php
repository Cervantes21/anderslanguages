<?php 
// if the url field is empty 
if(isset($_POST['url']) && $_POST['url'] == ''){

     // put your email address here     
     $youremail = 'bp@anderslanguages.com';

          $subject = "**EN* PROPOSAL *** Spanish Immersion x $_POST[name]"; 
     
     
     // prepare a "pretty" version of the message
     $body = "This is the form that was just submitted: 

---- PROPOSAL ----

$_POST[name]
$_POST[email]
$_POST[whatsapp]
$_POST[program]

---- DBASE ----

$_POST[name]*$_POST[email]*$_POST[whatsapp]*$_POST[boletin]"; 

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
     
     header('Location: ../../en/thankyou-prices.html');
exit('Redirecting you to ../../en/thankyou-prices.html');
     
     
     ?>