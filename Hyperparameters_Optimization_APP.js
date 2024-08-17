
var app={}, image=null,algo=null,MC=null, meilleur=null,
possition=[-0.6263393260559269, 35.69585752473928],
COLLECTION_ID = 'LANDSAT/LC08/C02/T1_TOA',
bands = ['B1','B2', 'B3', 'B4', 'B5', 'B6', 'B7'],
classes_App=[mer_a,sebkha_a,urbain_a,vegetation_a],
classes_Val=[mer,sebkha,urbain,vegetation],
palette=['Blue','Aqua','Yellow','Green','Red','DarkGoldenRod','Chartreuse','Chocolate ','DimGrey ','OrangeRed','Sienna','DeepPink','LightPink','LightSeaGreen','Navy'],
cost=[1,10,100],
gamma=[0.1,0.01,0.001];

app.creePanels = function(){
  app.intro = {
    panel: ui.Panel({
      widgets:[
        ui.Label({
          value: 'Hyperparameters Optimization APP',
          style: {fontWeight: 'bold', fontSize: '26px',backgroundColor:'#02031E',color:'#EDC605'}
        }),
        ui.Label({
          value: 'This APP allows you to classify a Lansat-8 image with the best HyperParameters of SVM with and without texture' ,
          style: app.TEXT_BLUE
        })
      ],
      style: app.SECTION_STYLE
    })
  };
  
  app.filters = {
    startDate: ui.Textbox('YYYY-MM-DD', '2018-01-01'),
    endDate: ui.Textbox('YYYY-MM-DD', '2018-12-31'),
    applyButton: ui.Button({
      label: 'Loading image',
      onClick: function() {
        app.applyFilters();
      },
      style: {width: '200px'}
    }),
    select: ui.Select({
      items: Object.keys(app.VIS_OPTIONS),
      onChange: function() {
        var option = app.VIS_OPTIONS[app.filters.select.getValue()];
        app.filters.label.setValue(option.description);
      },
      style:{width: '200px'}
    }),
    label: ui.Label({
      style:app.HELPER_TEXT_STYLE
    }),
    labelerreur: ui.Label({
      style:{fontSize: '13px',color: 'red', shown: true,backgroundColor:'#02031E'}
    }),
    loadingLabel: ui.Label({
      style: {stretch: 'vertical', fontSize: '16px',color: '#929BFC', shown: false,backgroundColor:'#02031E'}
    })
  };
  
  app.filters.panel = ui.Panel({
    widgets: [
      ui.Label('1) Date selection ', {fontWeight: 'bold', fontSize: '18px',backgroundColor:'#02031E',color:'#EDC605'}),
      ui.Panel({
        widgets:[
          ui.Panel({
            widgets:[
              ui.Label('Start date', app.HELPER_TEXT_STYLE),
              app.filters.startDate
            ],
            style:{backgroundColor:'#02031E',color:'#02031E'}
          }),
          ui.Panel({
            widgets:[
              ui.Label('End date', app.HELPER_TEXT_STYLE),
              app.filters.endDate
            ],
            style:{margin:'0px 0px 0px 30px',backgroundColor:'#02031E',color:'#02031E'}
          }),
          ],
        layout: ui.Panel.Layout.flow('horizontal'),
        style:{backgroundColor:'#02031E',color:'#02031E'}
      }),
      ui.Panel({
        widgets: [
          ui.Label('2) Visualization selection', {fontWeight: 'bold', fontSize: '18px',backgroundColor:'#02031E',color:'#EDC605'}),
          app.filters.select.setPlaceholder('choose ...'),
          app.filters.label
        ],
        style: app.SECTION_STYLE
      }),
        ui.Panel({
        widgets:[
        app.filters.applyButton,
        app.filters.loadingLabel
      ],
      layout: ui.Panel.Layout.flow('horizontal'),
      style:app.SECTION_STYLE
      }),
      ui.Panel({
        widgets:[
        app.filters.labelerreur
      ],
      style:app.SECTION_STYLE
      })
    ],
    style: app.SECTION_STYLE
  });
  
  app.parametre = {
    label: ui.Label({
      value:'',
      style:app.HELPER_TEXT_STYLE
    }),
    Button: ui.Button({
      label: 'Best HyperParameters',
      onClick: function() {
        app.Hyperparametre();
      },
      style: {width: '200px',margin: '10px 0 0 8px'}
    }),
    chargement: ui.Label({
      style: {stretch: 'vertical', fontSize: '16px',color: '#929BFC',backgroundColor:'#02031E'}
    }),
    labelerreur2: ui.Label({
      style:{fontSize: '13px',color: 'red', shown: true,backgroundColor:'#02031E'}
    })
  };
  
  app.parametre.panel = ui.Panel({
    widgets:[
      app.parametre.label,
      ui.Panel({
    widgets:[
      app.parametre.Button,
      app.parametre.chargement
    ],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {margin: '5px 0 0 0',fontSize: '16px',backgroundColor:'#02031E'}
  }),
    app.parametre.labelerreur2
    ],
    style: {margin: '5px 0 0 0',fontSize: '16px',shown: false,backgroundColor:'#02031E'}
  });
  
  app.classifieur = {
    select: ui.Select({
      items: Object.keys(app.Algorithmes),
      onChange: function() {
        app.resultat.panel.clear();
        var option = app.Algorithmes[app.classifieur.select.getValue()];
        algo =option.algo;
        if(algo==='svm'){
          app.parametre.panel.style().set('shown', true);
          app.classification.panel.style().set('shown',false);
          
        }
        else{
          app.parametre.panel.style().set('shown', false);
          app.classification.panel.style().set('shown',true);
        }
      },
      style:{width: '200px'}
    }),
  };
  
  app.classifieur.panel = ui.Panel({
    widgets:[
      ui.Label('3) Classifier selection', {fontWeight: 'bold', fontSize: '18px',backgroundColor:'#02031E',color:'#EDC605'}),
      app.classifieur.select.setPlaceholder('Choose ...'),
    ],
    style: app.SECTION_STYLE
  });
  
  app.classification = {
    Button: ui.Button({
      label: 'Start classification',
      onClick: function() {
        app.lancer();
      },
      style: {width: '200px',margin: '10px 0 0 8px'}
    }),
    labelerreur2: ui.Label({
      style:{fontSize: '13px',color: 'red', shown: true,backgroundColor:'#02031E'}
    }),
    texture: ui.Checkbox({label: 'textur', value: true,style:app.TEXT_BLUE})
  };
  
    app.classification.panel = ui.Panel({
    widgets:[
      ui.Label('4) Start classification', {fontWeight: 'bold', fontSize: '18px',backgroundColor:'#02031E',color:'#EDC605'}),
      app.classification.texture,
      app.classification.Button,
      app.classification.labelerreur2
    ],
    style: {margin: '5px 0 0 0',fontSize: '16px',shown: false,backgroundColor:'#02031E'}
  });
  
  app.resultat={};
  app.resultat.panel = ui.Panel({
    widgets:[
    ],
    style: app.SECTION_STYLE
  });
};

app.creeConstantes = function(){
  app.IMAGE_COUNT_LIMIT = 10;

  app.SECTION_STYLE = {
    margin: '5px 0 0 0',
    fontSize: '16px',
    backgroundColor:'#02031E'
  };
  app.HELPER_TEXT_STYLE = {
      margin: '5px 0 -3px 8px',
      fontSize: '13px',
      backgroundColor:'#02031E',
      color: 'gray'
  };
  app.style_elem ={
    margin: '0 3px 0 0',
    textAlign:'center',
    height:'40px',
    width:'80px',
    fontSize: '14px',
    color: '#02031E',
    backgroundColor:'#929BFC'
  };
  app.style_elem_borders = {
    margin: '0 3px 0 0',
    textAlign:'center',
    height:'40px',
    width:'80px',
    fontSize: '14px',
    color: 'gray',
    backgroundColor:'#02031E'
  };
  app.TEXT_BLUE = {
      fontSize: '16px',
      backgroundColor:'#02031E',
      textAlign:'center',
      color: '#929BFC'
  };
  app.Algorithmes = {
    'SVM': {
      algo:'svm'
    },
    'Random Forest': {
      algo:'rf'
    },
    'Cart': {
      algo:'cart'
    }
  };
  app.VIS_OPTIONS = {
    'False colors (B5/B4/B3)': {
      name:'False colors',
      description: 'The vegetation appears in different shades of red, the urban in light blue and the ground is in brown.',
      visParams: {gamma: 1.3, min: 0, max: 0.3, bands: ['B5', 'B4', 'B3']}
    },
    'True colors (B4/B3/B2)': {
      name:'True colors',
      description: 'Ground features appear in colors similar to those of the human visual system.',
      visParams: {gamma: 1.3, min: 0, max: 0.3, bands: ['B4', 'B3', 'B2']}
    }
  };
};

app.setLoadingMode = function(enabled) {
  app.filters.loadingLabel.style().set('shown', enabled);
  var loadDependentWidgets = [
    app.filters.startDate,
    app.filters.endDate,
    app.filters.select,
    app.filters.applyButton,
    app.classifieur.select,
    app.parametre.Button,
    app.classification.Button,
    app.classification.texture
  ];
  loadDependentWidgets.forEach(function(widget) {
    widget.setDisabled(enabled);
  });
};

app.applyFilters = function() {
  app.classification.labelerreur2.setValue('');
  app.parametre.labelerreur2.setValue('');
  Map.clear();
  Map.setCenter(possition[0], possition[1], 9);
  app.setLoadingMode(true);
  var filtered = ee.ImageCollection(COLLECTION_ID);
      filtered = filtered.filterBounds(Map.getCenter());
  var start = app.filters.startDate.getValue();
  if (start) start = ee.Date(start);
  var end = app.filters.endDate.getValue();
  if (end) end = ee.Date(end);
  if (start) filtered = filtered.filterDate(start, end);
  image = filtered
        .sort('CLOUD_COVER')
        .first()
        .select(bands);
    Map.clear();
    if(app.filters.select.getValue()){
      app.filters.loadingLabel.setValue('loading...');
      app.filters.labelerreur.setValue('');
      var visOption = app.VIS_OPTIONS[app.filters.select.getValue()];
      Map.addLayer(image, visOption.visParams,visOption.name);
      image.evaluate(function(ids) {
        app.setLoadingMode(false);
        app.filters.loadingLabel.setValue('');
      });
    }
    else{
        app.setLoadingMode(true);
        image=null;
        app.filters.labelerreur.setValue('Please select a visialisation.');
        app.setLoadingMode(false);
    }
};

app.lancer = function(){
  Map.clear();
  if(image===null || algo===null){
        app.classification.labelerreur2.setValue('Please select image');
        app.setLoadingMode(false);
  }
  else{
      var toolPanel = ui.Panel({widgets: [],style: {position: 'top-right',padding:'5px',minHeight: '160px',width: '140px'}});
        app.setLoadingMode(true);
        var classifieur;
        app.classification.labelerreur2.setValue('');
        MC='hh';
        if(app.classification.texture.getValue()){
          var ima=image.int8(),
          nir =ima.select('B5'),
          glcm = nir.glcmTexture({size: 4}),
          RGB = image;
          image =ee.Image(RGB).addBands(ee.Image(glcm));
          bands =image.bandNames();
        }
        var polygonsT = ee.FeatureCollection(classes_App);
        var polygonsV = ee.FeatureCollection(classes_Val);
        var training = image.select(bands).sampleRegions({collection: polygonsT,properties: ['Class'],scale: 30});
        var validation = image.sampleRegions({collection: polygonsV,properties: ['Class'],scale: 30});
        if(algo==='svm'){
          var type=ee.String(meilleur.get(0));
          if(type=='RBF')
          {
            var GC = ee.List(meilleur.get(1));
            classifieur = ee.Classifier.libsvm({
                kernelType: 'RBF',
                gamma:GC.get(0),
                cost:GC.get(1)
            });
          }
          else
          {
            classifieur = ee.Classifier.libsvm({
                   kernelType: 'linear',
                   cost: meilleur.get(1)
                });
          }
        }
        if(algo==='rf'){
          classifieur = ee.Classifier.smileRandomForest(10).train(training, 'Class');
        }
        else {
          classifieur = ee.Classifier.smileCart().train(training, 'Class', bands);
        }
        var trained = classifieur.train(training, 'Class', bands),
        classified = image.classify(trained);
        var colors=[];
        
        toolPanel.add(ui.Label('les classes', {margin: '4px',fontSize:'18px'}));
        var nom=[];
          for (var i = 0; i < classes_App.length; i++) {
            var c =classes_App[i].get("name");
            var nam = c.getInfo();
            var color = palette[i];
            colors.push(color);
            nom.push(nam);
            var colorBox = ui.Label('', {
              backgroundColor: color,
              padding: '10px',
              margin: '4px'
            });
            var description = ui.Label(nam, {margin: '4px',fontSize:'15px'});
            toolPanel.add(
                ui.Panel([colorBox, description], ui.Panel.Layout.Flow('horizontal')));
          }
          var max = (colors.length)-1;
        Map.add(toolPanel);
        Map.addLayer(classified, {min: 0, max:max , palette: colors},'Image Classifier');
        classified = validation.classify(trained);
        MC = classified.errorMatrix('Class', 'classification');
        var kappa = MC.kappa().getInfo();
        var acc=MC.accuracy().getInfo();
        MC=MC.getInfo();    
        var elem,lign,all;
        all = ui.Panel({
            widgets:[
            ],
            layout: ui.Panel.Layout.flow('vertical'),
            style:{margin:'0 0 0 8px',backgroundColor:'#02031E'}
          }); 
        lign = ui.Panel({
            widgets:[
              ui.Label({
                value: '',
                style: app.style_elem_borders
              })
            ],
            layout: ui.Panel.Layout.flow('horizontal'),
            style:{backgroundColor:'#02031E',margin: '0 0 3px 0'}
          });
        for(var k=0;k<classes_App.length;k++){
          lign.add(ui.Label({
            value: nom[k],
            style: app.style_elem_borders
          }));
        }
        all.add(lign) ;
        for(i=0;i<classes_App.length;i++)
        {
          lign = ui.Panel({
              widgets:[
                ],
                layout: ui.Panel.Layout.flow('horizontal'),
                style:{backgroundColor:'#02031E',margin: '0 0 3px 0'}
          });
          for(var j=0;j<classes_App.length;j++)
          {
            if(j===0){
              lign.add(ui.Label({
                value: nom[i],
                style: app.style_elem_borders
              }));
            }
            elem = ui.Label({
              value: '',
              style: app.style_elem
            });
            elem.setValue(MC[i][j]);
            lign.add(elem);
          }
          all.add(lign);
        }
        var table = ui.Panel({
            widgets:[
              all
              ],
              layout: ui.Panel.Layout.flow('horizontal'),
              style:{backgroundColor:'#02031E'}
        });
        app.resultat.panel.clear();
        app.resultat.panel.add(ui.Label('5)Results', {fontWeight: 'bold', fontSize: '18px',textAlign:'center',backgroundColor:'#02031E',color:'#EDC605'}));
        app.resultat.panel.add(ui.Label(' *) confusion matrix', {margin: '0 0 0 50px',fontWeight: 'bold', fontSize: '16px',backgroundColor:'#02031E',color:'#EDC605'}));
        app.resultat.panel.add(table);
        var hyper = ui.Label({
          value: kappa,
          style:{fontSize: '16px',backgroundColor:'#02031E',textAlign:'center',color: 'gray'} 
        });
        app.resultat.panel.add(ui.Label(' *) kappa', {margin: '0 0 0 50px',fontWeight: 'bold', fontSize: '16px',backgroundColor:'#02031E',color:'#EDC605'}));
        app.resultat.panel.add(hyper);
        hyper = ui.Label({
          value: acc,
          style:{fontSize: '16px',backgroundColor:'#02031E',textAlign:'center',color: 'gray'} 
        });
        app.resultat.panel.add(ui.Label(' *) precision ', {margin: '0 0 0 50px',fontWeight: 'bold', fontSize: '16px',backgroundColor:'#02031E',color:'#EDC605'}));
        app.resultat.panel.add(hyper);
        
        app.setLoadingMode(false);
      
      }
};

app.Hyperparametre = function(){
  if(image===null){
        app.parametre.labelerreur2.setValue('Please select image');
        app.setLoadingMode(false);
  }
  else{
    var a1,a2;
    app.parametre.chargement.setValue('loading...');
    if(algo!==null){
      
      var polygonsT = ee.FeatureCollection(classes_App);
  var polygonsV = ee.FeatureCollection(classes_Val);
  
  var training = image.select(bands).sampleRegions({
    collection: polygonsT,
    properties: ['Class'],
    scale: 30
  });
  var validation = image.sampleRegions({
    collection: polygonsV,
    properties: ['Class'],
    scale: 30
  });
  /////////////fonction qui fait la classification avec svm.//////////////////
  var svmclassif = function(trainingPartition,testingPartition,type)
      {
      //trainingPartition ==> les données training.
      //testingPartition ==> les données validation.
      var cl=[], a, m, n,Svm, trained, classified2, validation_MC, kap;
      if (type=='RBF')
      {
        //classifier avec le kernelType=RBF.
        a = cartesianProduct([gamma,cost]);
        a1=a;
        for (m = 0, n = a.length; m < n; m++)
        {
          Svm = ee.Classifier.libsvm({
             kernelType: 'RBF',
             gamma:a[m][0],
             cost:a[m][1]
          });
          trained = Svm.train(trainingPartition, 'Class', bands);
          classified2 = testingPartition.classify(trained);
          validation_MC = classified2.errorMatrix('Class', 'classification');
          kap = validation_MC.kappa();
          //ajouter le kappa dans la liste cl.
          cl.push(kap);
        }
      }
      else if (type=='linear')
      {
        //classifier avec le kernelType=linear.
        a=[1,10,100];
        a2=a;
        for (m = 0, n = a.length; m < n; m++)
        {
          Svm = ee.Classifier.libsvm({
             kernelType: 'linear',
             cost: a[m]
          });
          trained = Svm.train(trainingPartition, 'Class', bands);
          classified2 = testingPartition.classify(trained);
          validation_MC = classified2.errorMatrix('Class', 'classification');
          kap = validation_MC.kappa();
          cl.push(kap);
        }
      }
      //cl ==> compose de tout les kappa dans le méme cas.
      print('liste de tout les kappa:',cl);
      
      //list ==> changer le type de cl to List.
      var list = ee.List(cl);
      
      //eeList ==> Trie list par ordre croissant.
      var eeList = list.sort();
      
      //cl=meilleur kappa .
      cl =eeList.get(cl.length-1);
      print('meilleur kappa :',cl);
      
      //pos ==> la position de meilleur kappa dans la liste (list).
      var pos =list.indexOf(cl);
      print('position de kappa :',pos);
      
      //GC ==> le gamma et cost associés au meilleur kappa. 
      var GC = ee.List(ee.List(a).get(pos));
      
      //cl ==> liste composée de meilleur paramétre et kappa.
      cl=[type,GC,cl];
      return cl;
    };  
        
   
  /////////////// fonction de tout les cas possibles de cost et gamma ./////////     
   var cartesianProduct = function(arr)
    {
        return arr.reduce(function(a,b){
            return a.map(function(x){
                return b.map(function(y){
                    return x.concat(y);
                });
            }).reduce(function(a,b){ return a.concat(b) },[]);
        }, [[]]);
    };
    
    
  ///////////////// fonction de validation croisée .//////////////////////
    var validatCroi = function(k)
      {
        //k ==> le nombre de fold.
        var trainingPartition,testingPartition, c=[],
        split,fold=[],tr=training,t=[],withRandom;
        
        //tr ==> les données training.
            for(var i=0;i<k;i++)
              {
                if(i!=k-1){
                withRandom = tr.randomColumn('random');
                
                //spliter les données en 2 parties .
                split=1/(k-i);
                
                //par exp:
                //k=5 ==> split=1/4=0.20
                //la 1ere est testingPartition avec 20%.
                //la 2eme est trainingPartition avec 80%.
                testingPartition = withRandom.filter(ee.Filter.lt('random', split)),
                trainingPartition = withRandom.filter(ee.Filter.gte('random', split));
                
                // entrer dans une liste les données test et training.
                // pour chaque split.
                fold.push([trainingPartition.merge(t),testingPartition]);
                //trainingPartition.merge(t) ==> pour garder toutes les données.
                
                // tr ==> changer les données training pour les spliter.
                // et prendre juste la partie de trainingPartition.
                tr=trainingPartition;
                
                // t ==> garder les données testingPartition pour les ajouter.
                t=testingPartition.merge(t);
                
                //fait appel a la fonction de classification SVM pour chaque 
                //trainingPartition et testingPartition.
                c.push(svmclassif(fold[i][0],fold[i][1],'RBF'));
                c.push(svmclassif(fold[i][0],fold[i][1],'linear'));
              }
              else{
                // le dernier cas split=1 .
                fold.push([t,tr]);
                c.push(svmclassif(fold[i][0],fold[i][1],'RBF'));
                c.push(svmclassif(fold[i][0],fold[i][1],'linear'));
              }
              }
      return c;
    };
    var p=[],
    cl=validatCroi(2);
    // cl ==> une liste composée de mailleurs kappa et paramétre de svm
    //pour chaque splite.
    for(var m = 0, n = cl.length; m < n; m++)
    {
      //on prend tout les valeurs de kappa.
      p.push(cl[m][2]);
    }
    // et on cherche le meilleur kappa.
    var list = ee.List(p),
    eeList = list.sort(),
    c=eeList.get(p.length-1),
    //c ==> meilleur kappa.
    pos =list.indexOf(c);
    meilleur=ee.List(ee.List(cl).get(pos));
    meilleur=ee.List(meilleur);
    var a=ee.List(meilleur.get(1));
    var type=ee.String(meilleur.get(0));

    meilleur.evaluate(function(ids) {
          print(a);
      if(type=='RBF')
          {
            var c,g;
            c=a.get(0);
            g=a.get(1);
            var hyper = ui.Label({
            value: 'Best classifier is SVM "' +(meilleur.get(0)).getInfo()+'" : "'+c.getInfo() +"," +g.getInfo()+'"',
            style:app.TEXT_BLUE 
          });
          }
          else
          {
            hyper = ui.Label({
                value: 'Best classifier is SVM "' +(meilleur.get(0)).getInfo()+'" : "'+(meilleur.get(1)).getInfo()+'"',
                style:app.TEXT_BLUE 
              });
      }   
      
      app.parametre.panel.add(hyper);
      app.parametre.chargement.setValue('');
      app.classification.panel.style().set('shown',true);
        });
    }
    }
};

app.boot = function() {
  app.creeConstantes();
  app.creePanels();
  var main = ui.Panel({
    widgets: [
      app.intro.panel,
      app.filters.panel,
      app.classifieur.panel,
      app.parametre.panel,
      app.classification.panel,
      app.resultat.panel
    ],
    style: {width: '480px', padding: '15px',color: '#02031E',backgroundColor:'#02031E'}
  });
  Map.setCenter(possition[0], possition[1], 9);
  ui.root.insert(0, main);
};

app.boot();
