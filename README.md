# Petition_Project
This is an online petition website where supporters can register, log in, update their profile information, signature, delete their signature. Additionally They can view a list of all supporters and the supporters who signed from the same city(sorted by location)
## Live Website
https://freedomforshoppingcarts.herokuapp.com/register

## Overview
The idea behind this project is to create an online petition that visitors can sign to make their voice heard on an issue of using shopping carts without coins or sth like that.  

When users first arrive at this site they are directed to a page that explains the issue and presents a form to sign. The form have four elements: two text fields for first and last name, a hidden field for the signature, and a submit button. There is a <canvas> element on which users can draw their signature.

## Features
  
-I wrote client-side Javascript to allow users to draw on the canvas and to then set the value of the hidden form field to what they have drawn. I got the image data to put in the hidden field by calling the toDataURL method of the canvas.
  
-First name, last name, and signature are all required fields. If a user does not submit all three, or if an error happens for another reason, the page is displayed again with an error message.
  
-Once the data is saved, a cookie is set to remember this fact. Users can then be redirected to another page that expresses gratitude for their support.
  
-On subsequent visits to the site, people who have signed the petition are redirected to this page. They can not be given the opportunity to sign the petition again if they have the cookie indicating that they have already signed.
 
-Visitors have an profile page which they can edit their informations. They can also see all other supporter-list if they click see all signers link. 
  
-In all signers page there are supportes names and their cities both of them are links. If the visitors click the name of other supporter they can visit their homepage if it exists. If the users click the city name they are directed to a new page that shows only the people who have signed the petition that live in that city.
  
## Technology Stack
  <span><img src="https://img.shields.io/badge/PostgreSQL-fuchsia?style=for-the-badge&logo=postgresql&logoColor=white"></span>
 <span><img src="https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript&logoColor=white"></span>
 <span><img src="https://img.shields.io/badge/jQuery-blue?style=for-the-badge&logo=jquery&logoColor=white"></span>
  <span><img src="https://img.shields.io/badge/Canvas-2d-purple?style=for-the-badge&logo=canvas&logoColor=white"></span>
   <span><img src="https://img.shields.io/badge/Express-lightgrey?style=for-the-badge&logo=express&logoColor=white"></span>
   <span><img src="https://img.shields.io/badge/NodeJS-brightgreen?style=for-the-badge&logo=nodedotjs&logoColor=white"></span>
 <span><img src="https://img.shields.io/badge/Heroku-blueviolet?style=for-the-badge&logo=heroku&logoColor=white"></span>
   <span><img src="https://img.shields.io/badge/Jest-red?style=for-the-badge&logo=jest&logoColor=white"></span>
     <span><img src="https://cdn.iconscout.com/icon/free/png-256/handlebars-282936.png" width="70" height="35"></span>
  
  
  
## Preview
  
  **_Intro Page & Registration_**
  
<img src="public/images/petition register.gif">
  
  <br>
  
 **_Edit Profile_**
  
<img src="public/images/petition edit profile.gif">
  
  <br>
  
 **_Login & All Signers & Same City Signers_**
  
 <img src="public/images/petition login & same city signers.gif">
  
 <br>
  
 **_Delete Signature_**
  
<img src="public/images/petition gif 2.gif">
  



  
