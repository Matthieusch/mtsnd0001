<?php
require_once 'lib/class.phpmailer.php';

if (isset($_POST['inputName']) && isset($_POST['inputEmail']) && isset($_POST['inputSubject']) && isset($_POST['inputMessage'])) {

    //check if any of the inputs are empty
    if (empty($_POST['inputName']) || empty($_POST['inputEmail']) || empty($_POST['inputSubject']) || empty($_POST['inputMessage'])) {
        $data = array('success' => false, 'message' => 'Merci de remplir tous les champs.');
        echo json_encode($data);
        exit;
    }

    //create an instance of PHPMailer
    $mail = new PHPMailer();
    $mail->CharSet = 'UTF-8';
    $mail->From = $_POST['inputEmail'];
    $mail->FromName = $_POST['inputName'];
    $mail->AddAddress('matthieu.snd@gmail.com'); //recipient
    $mail->Subject = $_POST['inputSubject'];
    $mail->Body = "Nom : " . $_POST['inputName'] . "\r\n\r\nMessage : " . stripslashes($_POST['inputMessage']);

    if(!isset($_POST['inputUrl'])){
      if(!$mail->send()) {
          $data = array('success' => false, 'message' => 'Le message n\'a pu être envoyé. Erreur : ' . $mail->ErrorInfo);
          echo json_encode($data);
          exit;
      }
    }

    $data = array('success' => true, 'message' => 'Le message a bien été envoyé. Merci !');
    echo json_encode($data);

} else {

    $data = array('success' => false, 'message' => 'Merci de remplir tous les champs.');
    echo json_encode($data);

}
?>