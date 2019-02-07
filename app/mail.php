<?
  $datastr = str_replace(array('[', '] ', '"'), '', $_POST['data']);
  $array = explode(',', $datastr);
  $to = 'somerom71@gmail.com'; 
  $subject = 'Обратный звонок'; 
  $message = '
          <html>
              <head>
                  <title>'.$subject.'</title>
              </head>
              <body>
                  <p>Вы являетесь: <br> '.echo $array[1];.'</p>
                  <p>У вашего бизнеса есть задолженность по налогам? <br> '.$_POST['data'][2].'</p>
                  <p>Как часто в вашем бизнесе необходима помощь юриста? <br> '.$_POST['data'][2].'</p>
                  <p>Какие услуги Вам необходимы? <br> '.$_POST['data'][3].'</p>
                  <p>Как срочно Вам требуется юридическое сопровождение? <br> '.$_POST['data'][4].'</p>
                  <p>Телефон: <br> '.$_POST['data'][5].'</p>
                                        
              </body>
          </html>';
  $headers  = "Content-type: text/html; charset=utf-8 \r\n";
  $headers .= "From: Отправитель <from@example.com>\r\n";
  mail($to, $subject, $message, $headers);
?>