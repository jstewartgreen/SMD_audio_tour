// Tour stop data for San Miguel de Allende Audio Tour
// To add a new stop: copy one of the objects below, fill in the details,
// and add your audio (.mp3) and image (.jpg) files to the audio/ and images/ folders.

const STOPS = [
  {
    id: "parroquia",
    name_en: "Parroquia de San Miguel Arcángel",
    name_es: "Parroquia de San Miguel Arcángel",
    description_en: "This breathtaking neo-Gothic church is San Miguel's most iconic landmark. Its pink stone towers were designed in the late 19th century by self-taught indigenous architect Zeferino Gutiérrez, who is said to have sketched his inspiration from postcards of European cathedrals. The church anchors the Jardín Principal, the lively heart of the city.",
    description_es: "Esta impresionante iglesia neogótica es el monumento más icónico de San Miguel. Sus torres de piedra rosa fueron diseñadas a finales del siglo XIX por el arquitecto indígena autodidacta Zeferino Gutiérrez, quien dicen que se inspiró en postales de catedrales europeas. La iglesia ancla el Jardín Principal, el animado corazón de la ciudad.",
    lat: 20.9131,
    lng: -100.7450,
    audio_en: "audio/parroquia_en.mp3",
    audio_es: "audio/parroquia_es.mp3",
    image: "images/parroquia.jpg"
  },
  {
    id: "las_monjas",
    name_en: "Templo de la Concepción (Las Monjas)",
    name_es: "Templo de la Concepción (Las Monjas)",
    description_en: "Known locally as Las Monjas — 'The Nuns' — this 18th-century convent church features one of the finest domes in the Bajío region. The attached building is now the Centro Cultural El Nigromante, a beloved art school that has been a creative hub for painters, sculptors, and muralists since the 1950s.",
    description_es: "Conocida localmente como Las Monjas, esta iglesia conventual del siglo XVIII presenta una de las cúpulas más hermosas de la región del Bajío. El edificio anexo es ahora el Centro Cultural El Nigromante, una querida escuela de arte que ha sido un centro creativo para pintores, escultores y muralistas desde la década de 1950.",
    lat: 20.9127,
    lng: -100.7463,
    audio_en: "audio/las_monjas_en.mp3",
    audio_es: "audio/las_monjas_es.mp3",
    image: "images/las_monjas.jpg"
  },
  {
    id: "instituto_allende",
    name_en: "Instituto Allende",
    name_es: "Instituto Allende",
    description_en: "Founded in 1951, the Instituto Allende helped transform San Miguel into an international arts destination. Housed in a magnificent 18th-century hacienda, it attracted generations of American and Mexican artists and writers. Today it remains an active university and cultural center, with studios, galleries, and gardens open to visitors.",
    description_es: "Fundado en 1951, el Instituto Allende ayudó a transformar San Miguel en un destino artístico internacional. Ubicado en una magnífica hacienda del siglo XVIII, atrajo a generaciones de artistas y escritores estadounidenses y mexicanos. Hoy sigue siendo una universidad y centro cultural activo, con estudios, galerías y jardines abiertos al público.",
    lat: 20.9100,
    lng: -100.7484,
    audio_en: "audio/instituto_allende_en.mp3",
    audio_es: "audio/instituto_allende_es.mp3",
    image: "images/instituto_allende.jpg"
  }
];
