export interface Metric {
  label: string;
  value: string | number;
  status: 'low' | 'optimal' | 'high';
  recommendation: string;
}

export interface AnalysisResult {
  title: string;
  note: string;
  hausaNote: string;
  metrics: Metric[];
  overallScore?: number;
}

const translations = {
  rice: "Shinkafa tana bunƙasa a cikin yanayi mai danshi da dumi.",
  maize: "Masara tana buƙatar yanayin zafi da isasshen ruwan sama.",
  wheat: "Alkama tana girma sosai a cikin yanayin sanyi da bushewa.",
  cotton: "Auduga tana buƙatar dogon lokacin girma ba tare da sanyi ba.",
  coffee: "Kofi yana girma a cikin yanayin zafi na wurare masu zafi.",
  jute: "Jute tana buƙatar babban zafi da ruwan sama mai yawa.",
  mungbean: "Waken mung yana da jure fari kuma yana girma da sauri.",
  blackgram: "Blackgram yana bunƙasa a cikin yanayi mai dumi da danshi.",
  lentil: "Lentil tana son sanyi da kyau-drained ƙasa.",
  pomegranate: "Rumman yana girma sosai a cikin yanayi mai bushewa.",
  banana: "Ayaba tana bunƙasa a cikin wurare masu zafi da babban danshi.",
  mango: "Mangwaro sun fi son yanayin zafi da bushewa.",
  grapes: "Inabi suna bunƙasa a cikin ƙasa mai kyau-drained.",
  watermelon: "Kankana tana son yanayin zafi da yashi ƙasa.",
  muskmelon: "Kankana (Muskmelon) tana bunƙasa a cikin zafi da hasken rana.",
  apple: "Tuffa tana buƙatar sanyi hunturu da matsakaicin lokacin rani.",
  orange: "Lemu yana bunƙasa a cikin yanayin zafi tare da isasshen ruwa.",
  papaya: "Gwanda tana son yanayin zafi da danshi sosai.",
  coconut: "Kwakwa tana bunƙasa a bakin teku da yanayin wurare masu zafi.",
  cotton_hausa: "Auduga tana buƙatar kulawa sosai daga kwari.",
  alluvial: "Wannan ƙasa tana da kyau don yawancin amfanin gona.",
  black: "Wannan ƙasa tana da kyau don auduga.",
  red: "Wannan ƙasa tana da kyau don hatsi.",
  clayey: "Wannan ƙasa tana riƙe ruwa sosai.",
};

export const processCropAnalysis = (data: {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}): AnalysisResult => {
  // Mock logic to select a crop based on parameters
  let crop = "maize";
  if (data.rainfall > 200) crop = "rice";
  else if (data.temperature < 20) crop = "wheat";
  else if (data.humidity > 80) crop = "jute";
  else if (data.ph < 5.5) crop = "coffee";
  else if (data.rainfall < 50) crop = "muskmelon";

  const cropTitle = crop.charAt(0).toUpperCase() + crop.slice(1);
  const note = `Based on your soil's NPK levels (${data.nitrogen}, ${data.phosphorus}, ${data.potassium}) and environmental factors like ${data.temperature}°C and ${data.rainfall}mm rainfall, ${cropTitle} is the most suitable crop for your land.`;
  const hausaNote = translations[crop as keyof typeof translations] || "Wannan amfanin gona ya dace da ƙasarka.";

  const metrics: Metric[] = [
    {
      label: 'Nitrogen (N)',
      value: `${data.nitrogen} mg/kg`,
      status: data.nitrogen < 40 ? 'low' : data.nitrogen > 120 ? 'high' : 'optimal',
      recommendation: data.nitrogen < 40 ? 'Add urea or organic manure.' : 'Balanced nitrogen levels detected.',
    },
    {
      label: 'Phosphorus (P)',
      value: `${data.phosphorus} mg/kg`,
      status: data.phosphorus < 20 ? 'low' : data.phosphorus > 80 ? 'high' : 'optimal',
      recommendation: data.phosphorus < 20 ? 'Consider bone meal or DAP.' : 'Good phosphorus availability.',
    },
    {
      label: 'Potassium (K)',
      value: `${data.potassium} mg/kg`,
      status: data.potassium < 20 ? 'low' : data.potassium > 100 ? 'high' : 'optimal',
      recommendation: data.potassium < 20 ? 'Add MOP or wood ash.' : 'Potassium levels are sufficient.',
    },
  ];

  return { title: cropTitle, note, hausaNote, metrics };
};

export const processSoilAnalysis = (data: {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
}): AnalysisResult => {
  let soilType = "Alluvial Soil";
  if (data.ph < 5.0) soilType = "Laterite Soil";
  else if (data.ph > 8.0) soilType = "Saline Soil";
  else if (data.moisture > 70) soilType = "Clayey Soil";
  else if (data.moisture < 20) soilType = "Sandy Soil";

  const note = `The analysis indicates that your soil type is ${soilType}. It has a pH of ${data.ph} and moisture level of ${data.moisture}%. This soil is generally productive with proper management.`;
  const hausaNote = translations[soilType.split(' ')[0].toLowerCase() as keyof typeof translations] || "Wannan ƙasa tana da kyau don noma.";

  const metrics: Metric[] = [
    {
      label: 'Nitrogen (N)',
      value: `${data.nitrogen} mg/kg`,
      status: data.nitrogen < 30 ? 'low' : data.nitrogen > 120 ? 'high' : 'optimal',
      recommendation: data.nitrogen < 30 ? 'Low N. Apply organic matter.' : 'Adequate nitrogen.',
    },
    {
      label: 'Soil pH',
      value: `${data.ph}`,
      status: data.ph < 5.5 ? 'low' : data.ph > 7.5 ? 'high' : 'optimal',
      recommendation: data.ph < 5.5 ? 'Soil is acidic. Add lime.' : data.ph > 7.5 ? 'Soil is alkaline. Add sulfur.' : 'pH is optimal.',
    },
    {
      label: 'Moisture',
      value: `${data.moisture}%`,
      status: data.moisture < 25 ? 'low' : data.moisture > 70 ? 'high' : 'optimal',
      recommendation: data.moisture < 25 ? 'Low moisture. Increase irrigation.' : 'Good moisture content.',
    },
  ];

  const optimalCount = metrics.filter(m => m.status === 'optimal').length;
  const overallScore = Math.round((optimalCount / metrics.length) * 100);

  return { title: soilType, note, hausaNote, metrics, overallScore };
};
