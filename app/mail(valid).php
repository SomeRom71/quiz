<?
  $array = explode('"', $_POST['data']);
  $array = array_merge(array_diff($array, array("[", "]", ",")));
  $to = 'somerom71@gmail.com'; 
  $subject = 'Обратный звонок'; 
  $message = '
          <html>
              <head>
                  <title>'.$subject.'</title>
              </head>
              <body>
                  <p>Вы являетесь: <br> '.$array[0].'</p>
                  <p>У вашего бизнеса есть задолженность по налогам? <br> '.$array[1].'</p>
                  <p>Как часто в вашем бизнесе необходима помощь юриста? <br> '.$array[2].'</p>
                  <p>Какие услуги Вам необходимы? <br> '.$array[3].'</p>
                  <p>Как срочно Вам требуется юридическое сопровождение? <br> '.$array[4].'</p>
                  <p>Телефон: <br> '.$array[5].'</p>
                                        
              </body>
          </html>';
  $headers  = "Content-type: text/html; charset=utf-8 \r\n";
  $headers .= "From: Квиз опрос <from@example.com>\r\n";
  mail($to, $subject, $message, $headers);
?>