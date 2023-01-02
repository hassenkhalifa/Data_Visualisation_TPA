# Data_Visualisation_TPA

## 1- Analyse the data set

* How is the user ?
    * On a deux utilisateurs: le vendeur et le concessionnaire
* What is the goal of this user ?
    * Vendeur : Évaluer le type de véhicule susceptible d'intéresser un seule client.
    * Concessionnaire : Prédire le véhicule le plus adéquat pour plusieurs clients sélectionnés
* Identify goals & user tasks
    * Vendeur :
        * Goal: Search
        * Tasks: identify, Categorize
    * Concessionnaire :
        * Goal: Search
        * Tasks: Filter, Zoom, Categorize, identify, locate
* Select attributes you are going to use in the project
    * Immatriculations : Marque
  
    * Véhicules : Nom
    * véhicules: Puissance 
    * véhicules: Longueur 
    * véhicules: NbPlaces
    * véhicules: NbPortes 
    * véhicules: Couleur 
    * véhicules: Occasion 
    * véhicules: Prix
    * Véhicules: Marque
  
    * Client : Age
    * Client :Sexe
    * Client : Situation familiale 
    * Client : Nbr Enfant
    
## 2- Describe the visualization pipeline allowing to create a visual representation of data ( from  row data to visual variables )
* ( Revoir avec Safoune pour le process de nettoyage et de concaténation des données )

## 3- Describe the target users
* ( On pense qu'on répondu à cette question en dessus )

## 4- Describe the visualisation goals and user tasks
* ( On pense qu'on répondu à cette question en dessus )


## 5- Propose 4 visualization techniques using D3JS

* Data set
* Include interactive tasks ( ex. Navigation, selection,filters,...)
* Include two levels of visualization (overview & détails)
* Allow to change the dataset
* Provide an executable demonstration

#### Types of visualization to use:

* Hierarchic (treemap,sunburst,...) 
    * Circle Map (https://datavizcatalogue.com/methods/circle_packing.html) -> Concessionaire (Identify)
    * Treemap (https://datavizcatalogue.com/methods/treemap.html) -> Vendeur (Identify)
    
* Comparisons 
  * Pie Chart (https://datavizcatalogue.com/methods/pie_chart.html) -> Vendeurs

* Distribution
  * Multi-set Bar Chart (https://datavizcatalogue.com/methods/multiset_barchart.html) -> Concessionaire 

##### Websites that can help us:

* https://datavizcatalogue.com
* https://d3js.org