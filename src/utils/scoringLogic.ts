import { AssessmentState } from '../types';

export const calculateEligibility = (state: AssessmentState): { score: number, details: any } => {
  let score = 0;
  const details = {
    netWorth: 0,
    investment: 0,
    language: 0,
    experience: 0,
    readiness: 0,
  };

  // 1. Net Worth (max 25)
  if (state.netWorth) {
    if (state.netWorth >= 800000) details.netWorth = 25;
    else if (state.netWorth >= 600000) details.netWorth = 20;
    else if (state.netWorth >= 400000) details.netWorth = 15;
    else if (state.netWorth >= 300000) details.netWorth = 5;
  }

  // 2. Investment Readiness (max 25)
  if (state.investment) {
    if (state.investment >= 500000) details.investment = 25;
    else if (state.investment >= 200000) details.investment = 20;
    else if (state.investment >= 150000) details.investment = 15;
    else if (state.investment >= 100000) details.investment = 10;
  }

  // 3. Language (max 20)
  if (state.language) {
    const lang = state.language.toLowerCase();
    if (lang.includes('basic') || lang.includes('poor') || lang.includes('beginner') || lang.includes('low') || lang.includes('clb 3') || lang.includes('clb 2') || lang.includes('clb 1')) {
      details.language = 5;
    } else if (lang.includes('fluent') || lang.includes('native') || lang.includes('excellent') || lang.includes('clb 5') || lang.includes('clb 6') || lang.includes('clb 7') || lang.includes('advanced') || lang.includes('bilingual') || lang.includes('high') || lang.includes('good')) {
      details.language = 20;
    } else {
      details.language = 15;
    }
  }

  // 4. Experience (max 20)
  const bizExp = typeof state.businessExperience === 'number' ? state.businessExperience : parseInt(state.businessExperience as string || '0');
  const mgmtExp = typeof state.managementExperience === 'number' ? state.managementExperience : parseInt(state.managementExperience as string || '0');
  
  if (bizExp >= 3) details.experience = 20;
  else if (mgmtExp >= 5) details.experience = 15;
  else if (bizExp > 0 || mgmtExp > 0) details.experience = 10;

  // 5. General Readiness (max 10)
  if (state.citizenship && state.age && state.education) {
    details.readiness = 10;
  } else if (state.citizenship) {
    details.readiness = 5;
  }

  score = details.netWorth + details.investment + details.language + details.experience + details.readiness;
  
  return { score, details };
};

export const getProvinceMatches = (state: AssessmentState) => {
  const nw = state.netWorth || 0;
  const inv = state.investment || 0;
  const matches = [];

  // British Columbia Base
  if (nw >= 600000 && inv >= 200000) {
    matches.push({
      province: 'British Columbia Base Stream',
      suitability: 95,
      investment: 'CAD $200,000+',
      netWorth: 'CAD $600,000+',
      language: 'CLB 4',
      competitive: 'High'
    });
  }

  // British Columbia Regional
  if (nw >= 300000 && inv >= 100000) {
    matches.push({
      province: 'British Columbia Regional Stream',
      suitability: 85,
      investment: 'CAD $100,000+',
      netWorth: 'CAD $300,000+',
      language: 'CLB 4',
      competitive: 'Medium'
    });
  }

  // Ontario
  if (nw >= 400000 && inv >= 200000) {
    matches.push({
      province: 'Ontario Entrepreneur Stream',
      suitability: inv >= 600000 ? 90 : 70,
      investment: 'CAD $200,000 - $600,000+',
      netWorth: 'CAD $400,000 - $800,000+',
      language: 'CLB 4 (upon nomination)',
      competitive: 'Very High'
    });
  }

  // Nova Scotia
  if (nw >= 600000 && inv >= 150000) {
    matches.push({
      province: 'Nova Scotia Entrepreneur',
      suitability: 88,
      investment: 'CAD $150,000+',
      netWorth: 'CAD $600,000+',
      language: 'CLB 5 recommended',
      competitive: 'Medium'
    });
  }
  
  // PEI
  if (nw >= 600000) {
     matches.push({
      province: 'PEI Work Permit Stream',
      suitability: 80,
      investment: 'Variable',
      netWorth: 'CAD $600,000+',
      language: 'CLB 4',
      competitive: 'High'
    });
  }

  return matches.sort((a, b) => b.suitability - a.suitability);
};

export const calculateCosts = (state: AssessmentState) => {
  const inv = state.investment || 150000;
  return {
    governmentFees: 2500,
    investment: inv,
    settlement: 25000,
    legal: 15000,
    misc: 3000,
    total: 2500 + inv + 25000 + 15000 + 3000
  };
};
