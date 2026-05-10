import type { Question } from "./types";

let _nextId = 1;
const q = (subject: string, text: string, options: string[], correctOption: number, difficulty: Question["difficulty"] = "medium", explanation?: string): Question => ({
  id: String(_nextId++),
  subject, text, options, correctOption, difficulty, explanation,
});

export const SEED_QUESTIONS: Question[] = [
  // Mathematics
  q("Mathematics", "Simplify: (2x² + 5x - 3) ÷ (x + 3)", ["2x - 1", "2x + 1", "x - 1", "2x - 3"], 0, "medium", "Factor numerator: (2x-1)(x+3), cancel (x+3)."),
  q("Mathematics", "Find the derivative of f(x) = 3x³ - 2x² + 5x - 1", ["9x² - 4x + 5", "9x² + 4x - 5", "6x² - 4x + 5", "9x² - 4x - 5"], 0, "medium"),
  q("Mathematics", "If log₂(x) = 5, find x.", ["10", "25", "32", "64"], 2, "easy"),
  q("Mathematics", "The sum of an arithmetic progression is 400. If the first term is 5 and last term is 35, find the number of terms.", ["20", "22", "24", "25"], 3, "medium"),
  q("Mathematics", "Evaluate ∫(2x + 3)dx from 0 to 2.", ["10", "12", "14", "16"], 2, "medium"),
  q("Mathematics", "If a matrix A = [[2,1],[3,4]], find its determinant.", ["5", "8", "11", "6"], 0, "easy"),
  q("Mathematics", "Solve for x: 2^(x+1) = 16", ["2", "3", "4", "5"], 1, "easy"),
  q("Mathematics", "Find the equation of a line passing through (2, 3) with slope 4.", ["y = 4x - 5", "y = 4x + 5", "y = 4x - 3", "y = 4x + 3"], 0, "easy"),

  // English Language
  q("English", "Choose the correct spelling.", ["Accomodate", "Accommodate", "Acomodate", "Accomdate"], 1, "easy"),
  q("English", "Identify the figure of speech: 'The wind whispered through the trees.'", ["Simile", "Metaphor", "Personification", "Hyperbole"], 2, "easy"),
  q("English", "Which sentence is grammatically correct?", [
    "Neither of the boys have done their homework.",
    "Neither of the boys has done his homework.",
    "Neither of the boys have done his homework.",
    "Neither of the boys has done their homework."
  ], 1, "medium"),
  q("English", "The word 'EPHEMERAL' means:", ["Eternal", "Lasting only a short time", "Spiritual", "Very old"], 1, "medium"),
  q("English", "Choose the word closest in meaning to 'LOQUACIOUS'.", ["Silent", "Talkative", "Wise", "Aggressive"], 1, "easy"),
  q("English", "Identify the type of clause: 'When it rains, the streets get flooded.'", ["Relative clause", "Adverbial clause", "Noun clause", "Adjectival clause"], 1, "medium"),
  q("English", "Which of the following is a correct use of the apostrophe?", ["The dog's bone", "The dogs' bone's", "The dog's' bone", "The dogs bone"], 0, "easy"),

  // Physics
  q("Physics", "A body of mass 5 kg is moving with a velocity of 20 m/s. Find its kinetic energy.", ["500 J", "1000 J", "2000 J", "250 J"], 2, "easy", "KE = ½mv² = ½ × 5 × 400 = 1000 J. Wait: ½ × 5 × 400 = 1000J"),
  q("Physics", "The unit of electric potential is:", ["Ampere", "Ohm", "Volt", "Watt"], 2, "easy"),
  q("Physics", "A car accelerates from rest to 30 m/s in 10 seconds. What is its acceleration?", ["3 m/s²", "300 m/s²", "0.33 m/s²", "30 m/s²"], 0, "easy"),
  q("Physics", "Which of the following is NOT a vector quantity?", ["Velocity", "Force", "Speed", "Displacement"], 2, "medium"),
  q("Physics", "According to Ohm's law, if resistance is doubled and voltage is constant, current:", ["Doubles", "Remains constant", "Halves", "Quadruples"], 2, "medium"),
  q("Physics", "The frequency of a wave is 500 Hz and its wavelength is 0.4 m. Find the wave speed.", ["200 m/s", "1250 m/s", "125 m/s", "2000 m/s"], 0, "medium", "v = fλ = 500 × 0.4 = 200 m/s"),
  q("Physics", "A transformer has 200 turns in primary and 1000 turns in secondary coil. If input voltage is 50V, output voltage is:", ["250V", "100V", "10V", "2500V"], 0, "medium"),

  // Chemistry
  q("Chemistry", "What is the chemical formula of sulfuric acid?", ["HCl", "H₂SO₃", "H₂SO₄", "H₂S"], 2, "easy"),
  q("Chemistry", "An element has atomic number 17 and mass number 35. How many neutrons does it have?", ["17", "18", "35", "52"], 1, "easy", "Neutrons = Mass number - Atomic number = 35 - 17 = 18"),
  q("Chemistry", "Which of the following is a noble gas?", ["Nitrogen", "Oxygen", "Neon", "Fluorine"], 2, "easy"),
  q("Chemistry", "What type of bond exists in NaCl?", ["Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"], 1, "easy"),
  q("Chemistry", "The pH of a solution is 3. The solution is:", ["Strongly alkaline", "Weakly alkaline", "Neutral", "Acidic"], 3, "easy"),
  q("Chemistry", "Which process converts crude oil into useful fractions?", ["Cracking", "Fractional distillation", "Polymerization", "Hydrogenation"], 1, "medium"),
  q("Chemistry", "The number of moles in 44g of CO₂ (molar mass = 44 g/mol) is:", ["0.5", "1", "2", "44"], 1, "easy"),

  // Biology
  q("Biology", "The process by which plants make food using sunlight is called:", ["Respiration", "Transpiration", "Photosynthesis", "Osmosis"], 2, "easy"),
  q("Biology", "Which organelle is known as the 'powerhouse of the cell'?", ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"], 2, "easy"),
  q("Biology", "The human heart has how many chambers?", ["2", "3", "4", "5"], 2, "easy"),
  q("Biology", "Which blood group is the universal donor?", ["A", "B", "AB", "O"], 3, "easy"),
  q("Biology", "The functional unit of the kidney is:", ["Nephron", "Neuron", "Alveolus", "Villus"], 0, "medium"),
  q("Biology", "Which vitamin is produced when skin is exposed to sunlight?", ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], 3, "easy"),
  q("Biology", "DNA replication occurs during which phase of mitosis?", ["Prophase", "S phase (Interphase)", "Metaphase", "Anaphase"], 1, "medium"),

  // Economics
  q("Economics", "The law of demand states that, all other things being equal:", ["As price rises, demand rises", "As price falls, demand falls", "As price rises, quantity demanded falls", "Price and demand are unrelated"], 2, "easy"),
  q("Economics", "GDP stands for:", ["General Domestic Product", "Gross Domestic Product", "Gross Departmental Product", "General Development Plan"], 1, "easy"),
  q("Economics", "Which of the following is an example of a public good?", ["A private car", "A cinema ticket", "National defense", "A restaurant meal"], 2, "medium"),
  q("Economics", "Inflation is best defined as:", ["A fall in the value of money", "A rise in production levels", "A decrease in unemployment", "A rise in interest rates"], 0, "medium"),
  q("Economics", "When marginal cost equals marginal revenue, a firm is at:", ["Breakeven point", "Profit maximization", "Loss minimization", "Shutdown point"], 1, "medium"),

  // Government
  q("Government", "The principle of separation of powers was propounded by:", ["John Locke", "Jean-Jacques Rousseau", "Montesquieu", "Thomas Hobbes"], 2, "medium"),
  q("Government", "Nigeria operates which type of government?", ["Unitary", "Confederal", "Federal", "Parliamentary"], 2, "easy"),
  q("Government", "The ECOWAS treaty was signed in:", ["1960", "1975", "1980", "1990"], 1, "medium"),
  q("Government", "Which organ of government interprets the law?", ["Executive", "Legislature", "Judiciary", "Civil service"], 2, "easy"),
  q("Government", "A bill becomes a law when it receives:", ["Senate approval", "Presidential assent", "House approval", "Cabinet approval"], 1, "medium"),

  // Literature
  q("Literature", "Which of the following is a dramatic technique where the audience knows something characters don't?", ["Soliloquy", "Dramatic irony", "Aside", "Deus ex machina"], 1, "medium"),
  q("Literature", "The term 'protagonist' refers to:", ["The villain of a story", "The main character of a story", "The narrator of a story", "A minor character"], 1, "easy"),
  q("Literature", "Which literary device involves the repetition of consonant sounds at the start of words?", ["Assonance", "Rhyme", "Alliteration", "Onomatopoeia"], 2, "easy"),
  q("Literature", "'Things Fall Apart' was written by:", ["Wole Soyinka", "Chinua Achebe", "Ngugi wa Thiong'o", "Ben Okri"], 1, "easy"),

  // Geography
  q("Geography", "The largest continent by area is:", ["Africa", "Asia", "North America", "Europe"], 1, "easy"),
  q("Geography", "The River Niger flows into which body of water?", ["Indian Ocean", "Atlantic Ocean", "Gulf of Guinea", "Mediterranean Sea"], 2, "easy"),
  q("Geography", "Which type of rock is formed from cooled magma?", ["Sedimentary", "Metamorphic", "Igneous", "Limestone"], 2, "easy"),
  q("Geography", "The imaginary line dividing the earth into Northern and Southern hemispheres is:", ["Tropic of Cancer", "Tropic of Capricorn", "Prime Meridian", "Equator"], 3, "easy"),
  q("Geography", "What is the capital of South Africa's legislative branch?", ["Pretoria", "Cape Town", "Johannesburg", "Durban"], 1, "medium"),
];
