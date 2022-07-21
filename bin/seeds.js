const mongoose = require('mongoose');
const City = require('../models/City.model');


const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/get-your-city';


const cities = [
  {
      name: "Berlin",
      country: "Germany",
      description:
          "Berlin is the capital and largest city of Germany by both area and population.Berlin straddles the banks of the Spree, which flows into the Havel (a tributary of the Elbe) in the western borough of Spandau. Among the city's main topographical features are the many lakes in the western and southeastern boroughs formed by the Spree, Havel and Dahme, the largest of which is Lake Müggelsee. Due to its location in the European Plain, Berlin is influenced by a temperate seasonal climate. About one-third of the city's area is composed of forests, parks, gardens, rivers, canals and lakes.[11] The city lies in the Central German dialect area, the Berlin dialect being a variant of the Lusatian-New Marchian dialects.",
      imageUrl: "https://res.cloudinary.com/dkkdyfrlb/image/upload/v1658311083/movie-project/wkizzymef6cdkfnj0xdc.jpg"
  },
  {
    name: "Prague",
    country: "Czech Republic",
    description:
        "Its the capital and largest city in the Czech Republic, and the historical capital of Bohemia. On the Vltava river, Prague is home to about 1.3 million people. The city has a temperate oceanic climate, with relatively warm summers and chilly winters. Prague is a political, cultural, and economic hub of central Europe, with a rich history and Romanesque, Gothic, Renaissance and Baroque architecture.",
    imageUrl: "https://res.cloudinary.com/dkkdyfrlb/image/upload/v1658227045/movie-project/zlodttr6chk75o42ry58.jpg"
  },
  {
    name: "Barcelona",
    country: "Spain",
    description:
        "Barcelona is a city on the coast of northeastern Spain. It is the capital and largest city of the autonomous community of Catalonia, as well as the second most populous municipality of Spain. With a population of 1.6 million within city limits, its urban area extends to numerous neighbouring municipalities within the Province of Barcelona and is home to around 4.8 million people, making it the fifth most populous urban area in the European Union after Paris, the Ruhr area, Madrid, and Milan. It is one of the largest metropolises on the Mediterranean Sea, located on the coast between the mouths of the rivers Llobregat and Besòs, and bounded to the west by the Serra de Collserola mountain range, the tallest peak of which is 512 metres (1,680 feet) high.",
    imageUrl: "https://res.cloudinary.com/dkkdyfrlb/image/upload/v1658246598/movie-project/my8zwdkkizxh4bdc7h0o.jpg"
  },
  {
    name: "London",
    country: "UK",
    description:
        "London is the capital and largest city of England and the United Kingdom, with a population of just over 9 million. It stands on the River Thames in south-east England at the head of a 50-mile (80 km) estuary down to the North Sea, and has been a major settlement for two millennia. The City of London, its ancient core and financial centre, was founded by the Romans as Londinium and retains boundaries close to its medieval ones. Since the 19th century, the name London has also referred to the metropolis around this core, historically split between the counties of Middlesex, Essex, Surrey, Kent, and Hertfordshire, which largely comprises Greater London, governed by the Greater London Authority. The City of Westminster, to the west of the City of London, has for centuries held the national government and parliament.",
    imageUrl: "https://res.cloudinary.com/dkkdyfrlb/image/upload/v1658336362/movie-project/ehcp05css7wej070tnvu.jpg"
  },
  {
    name: "Madrid",
    country: "Spain",
    description:
        "Madrid is the capital and most populous city of Spain. The city has almost 3.4 million inhabitants and a metropolitan area population of approximately 6.7 million. It is the second-largest city in the European Union (EU), and its monocentric metropolitan area is the second-largest in the EU. The municipality covers 604.3 km2 (233.3 sq mi) geographical area. Madrid lies on the River Manzanares in the central part of the Iberian Peninsula. Capital city of both Spain (almost without interruption since 1561) and the surrounding autonomous community of Madrid (since 1983), it is also the political, economic and cultural centre of the country. The city is situated on an elevated plain about 300 km (190 mi) from the closest seaside location. The climate of Madrid features hot summers and cool winters.",
    imageUrl: "https://res.cloudinary.com/dkkdyfrlb/image/upload/v1658337132/movie-project/tgfs4b2uiy9whtzwfjb6.jpg"
  }
];


mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
    // Book.collection.drop();  // Warning, drops book collection :)
    // Author.collection.drop();  // Warning, drops author collection :)

    

  City.create(cities)
  .then(newCities => {
    console.log("New cities added to the website:", newCities.length);
    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(`An error occurred while creating books from the DB: ${err}`)
  });
