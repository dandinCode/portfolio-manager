export interface AnalysisResult {
  stock_list: string[];
  dy_list: number[];
  standard_deviation_list: number[];
  sectors_list: string[];
  acceptable_risk: number;
}

export interface StockAllocation {
  stock: string;
  sector: string;
  percentage: number;
}

export interface PortfolioOptimization {
  dividend_yield: number;
  portfolio_risk: number;
  acceptable_risk: number;
  stock_allocation: StockAllocation[];
  allocation_by_sector: Record<string, number>;
}
