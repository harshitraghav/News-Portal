var app=angular.module("MyApp",['ngRoute','ngCookies','ngFileUpload']);
app.config(function($routeProvider)
{
  $routeProvider
  .when("/",
  {
      templateUrl:'login.html',
      controller:'loginCtrl'
  })
  .when("/dashboard",
  {
      templateUrl:'dash.html',
      
  })
  .when("/cpass",
  {
      templateUrl:'cpass.html',
      controller:'cpass'
      
  })
  .when("/logout",
  {
      templateUrl:'login.html',
      controller:'loginCtrl',function($scope,$location,$routeParams,$route){
        $route.reload();

      }
      
  })
  .when("/home",{
  templateUrl:'home.html',
   controller:function($scope,$http)
      {console.log("yo");
         $http.get("http://localhost:8045/fetnews").then(function(res)
         {console.log("hi");
           $scope.new=res.data;
           console.log($scope.new);
         })
         $scope.del=function()
         {
             alert("hii");
         }
      }
  })
   .when('/delcat/:dat',
  {
      template:'',
      controller:function($scope,$routeParams,$http,$location)
      {
          da=$routeParams.dat;
          $http.delete("http://localhost:8045/delcat/"+da).then(function(res)
          {
              if(res.data.error ==0)
              {
                           $location.url('home');

              }
           /* db.collection("news").remove(da, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
    db.close();
  });*/
          })
      }
  })
  .when("/addnews",
  {
      templateUrl:'addnews.html',
      controller:'addnews'
      
  })
})
app.controller("MyCtrl",function($cookieStore,$scope,$location)
{
  cr=$cookieStore.get('idd');
   $scope.cok=cr;
   $scope.logout=function()
   {
      $cookieStore.remove('idd');
     $location.url('/');
   }
})
app.controller("loginCtrl",function($scope,$http,$cookieStore,$location)
{ console.log('reached');
  $scope.login=function()
  { console.log('hi');
      $http.post("http://localhost:8045/login",$scope.myData).then(function(res)
      {
        console.log(res.data.msg);
        if(res.data.error==0)
         {
           //console.log("Cookie created");
           id=res.data.msg;
           $cookieStore.put('idd',id); 
           $location.url('dashboard');
         }
         else
         {        console.log(res.data.msg);

            $scope.msg=false;
         }
      })
  }
})
app.controller("cpass",function($scope,$http,$cookieStore)
{
  
  $scope.chpass=function()
  {
    if($scope.myData.cp===$scope.myData.np)
    {
      var op=$scope.myData.op;
      var np=$scope.myData.np;
       var id=$cookieStore.get('idd');
       var data={uid:id,opp:op,npp:np};
       $http.post("http://localhost:8045/chpass",data).then(function(res)
       {
         console.log(res.data)
         $scope.data=res.data;
       })
    }
    else
    {
      alert("Np and cp are not match");
    }
  }
})
app.controller('addnews',function($scope,$http,Upload)
{
  $scope.addnews=function()
  {
   // console.log($scope.file)
     Upload.upload({
            url: 'http://localhost:8045/addnews',
            data: {file: $scope.file}
        }).then(function (resp)
         {
           console.log("data");
 $http.post("http://localhost:8045/addnews",$scope.myData).then(function(res)
     {
        console.log(res.data)
     })
        }, function (resp) 
        {
            console.log('Error status: ' + resp.status);
        })
   
  }
  })











