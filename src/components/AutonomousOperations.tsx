import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { UserPreferences, PortfolioStrategy, YieldStrategy, TradingStrategy } from '@/utils/autonomousOperations';

export default function AutonomousOperations() {
  const { connected, account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('portfolio');
  
  // Portfolio strategy state
  const [portfolioStrategy, setPortfolioStrategy] = useState<PortfolioStrategy>({
    targetAllocations: {
      'APT': 50,
      'USDC': 30,
      'USDT': 20
    },
    rebalanceThreshold: 5,
    riskTolerance: 'medium'
  });
  
  // Yield strategy state
  const [yieldStrategy, setYieldStrategy] = useState<YieldStrategy>({
    minYieldThreshold: 3,
    maxExposurePerProtocol: 30,
    preferredProtocols: ['Joule', 'Amnis', 'Thala']
  });
  
  // Trading strategy state
  const [tradingStrategy, setTradingStrategy] = useState<TradingStrategy>({
    tradingType: 'dca',
    targetToken: 'APT',
    sourceToken: 'USDC',
    amount: 10,
    frequency: 'weekly'
  });
  
  // Handle portfolio analysis
  const handleAnalyzePortfolio = async () => {
    if (!connected || !account || !privateKey) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/autonomous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'analyzePortfolio',
          privateKey,
          walletAddress: account.address,
          preferences: {
            portfolioStrategy
          }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data.result);
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
      setResult({ error: 'Failed to analyze portfolio' });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle yield optimization
  const handleFindYieldOpportunities = async () => {
    if (!connected || !privateKey) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/autonomous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'findYieldOpportunities',
          privateKey,
          preferences: {
            yieldStrategy
          }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data.result);
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      console.error('Error finding yield opportunities:', error);
      setResult({ error: 'Failed to find yield opportunities' });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle trading strategy execution
  const handleExecuteTradingStrategy = async () => {
    if (!connected || !privateKey) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/autonomous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'executeTradingStrategy',
          privateKey,
          strategy: tradingStrategy
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data.result);
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      console.error('Error executing trading strategy:', error);
      setResult({ error: 'Failed to execute trading strategy' });
    } finally {
      setLoading(false);
    }
  };
  
  // Update portfolio allocation
  const handleAllocationChange = (token: string, value: number) => {
    setPortfolioStrategy(prev => ({
      ...prev,
      targetAllocations: {
        ...prev.targetAllocations,
        [token]: value
      }
    }));
  };
  
  // Render result
  const renderResult = () => {
    if (!result) return null;
    
    if (result.error) {
      return (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          <p className="font-semibold">Error:</p>
          <p>{result.error}</p>
        </div>
      );
    }
    
    if (activeTab === 'portfolio' && result.currentAllocation) {
      return (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-semibold">Portfolio Analysis:</p>
          <p>Total Value: {result.totalValue}</p>
          <div className="mt-2">
            <p className="font-semibold">Current Allocation:</p>
            {Object.entries(result.currentAllocation).map(([token, percentage]: [string, any]) => (
              <p key={token}>{token}: {percentage.toFixed(2)}%</p>
            ))}
          </div>
          {result.recommendedActions.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Recommended Actions:</p>
              <ul className="list-disc pl-5">
                {result.recommendedActions.map((action: string, index: number) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    
    if (activeTab === 'yield' && result.opportunities) {
      return (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-semibold">Yield Opportunities:</p>
          <div className="mt-2">
            {result.opportunities.map((opp: any, index: number) => (
              <p key={index}>{opp.protocol} ({opp.token}): {opp.apy}% APY - Risk: {opp.risk}</p>
            ))}
          </div>
          {result.recommendedActions.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Recommended Actions:</p>
              <ul className="list-disc pl-5">
                {result.recommendedActions.map((action: string, index: number) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    
    if (activeTab === 'trading' && result.message) {
      return (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-semibold">Trading Strategy Execution:</p>
          <p>{result.message}</p>
          {result.txHash && (
            <p className="mt-2">
              Transaction Hash: <span className="font-mono">{result.txHash}</span>
            </p>
          )}
        </div>
      );
    }
    
    return (
      <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
        <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };
  
  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Autonomous Operations</CardTitle>
          <CardDescription>Connect your wallet to use autonomous features</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please connect your wallet to access autonomous operations.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Autonomous Operations</CardTitle>
        <CardDescription>Configure and execute autonomous operations</CardDescription>
      </CardHeader>
      <CardContent>
        {!privateKey ? (
          <div className="mb-4">
            <Label htmlFor="privateKey">Enter your private key:</Label>
            <Input
              id="privateKey"
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Enter your private key"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your private key is required for executing transactions and is never stored on our servers.
              The key will be automatically formatted to be AIP-80 compliant.
            </p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="portfolio">Portfolio Management</TabsTrigger>
              <TabsTrigger value="yield">Yield Optimization</TabsTrigger>
              <TabsTrigger value="trading">Trading Strategies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="portfolio" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label>Target Allocations</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="apt-allocation">APT (%)</Label>
                      <Input
                        id="apt-allocation"
                        type="number"
                        value={portfolioStrategy.targetAllocations.APT}
                        onChange={(e) => handleAllocationChange('APT', Number(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="usdc-allocation">USDC (%)</Label>
                      <Input
                        id="usdc-allocation"
                        type="number"
                        value={portfolioStrategy.targetAllocations.USDC}
                        onChange={(e) => handleAllocationChange('USDC', Number(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="usdt-allocation">USDT (%)</Label>
                      <Input
                        id="usdt-allocation"
                        type="number"
                        value={portfolioStrategy.targetAllocations.USDT}
                        onChange={(e) => handleAllocationChange('USDT', Number(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rebalance-threshold">Rebalance Threshold (%)</Label>
                      <Input
                        id="rebalance-threshold"
                        type="number"
                        value={portfolioStrategy.rebalanceThreshold}
                        onChange={(e) => setPortfolioStrategy(prev => ({ ...prev, rebalanceThreshold: Number(e.target.value) }))}
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
                  <Select
                    value={portfolioStrategy.riskTolerance}
                    onValueChange={(value: any) => setPortfolioStrategy(prev => ({ ...prev, riskTolerance: value }))}
                  >
                    <SelectTrigger id="risk-tolerance">
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleAnalyzePortfolio} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Analyze Portfolio
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="yield" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="min-yield">Minimum Yield Threshold (%)</Label>
                  <Input
                    id="min-yield"
                    type="number"
                    value={yieldStrategy.minYieldThreshold}
                    onChange={(e) => setYieldStrategy(prev => ({ ...prev, minYieldThreshold: Number(e.target.value) }))}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="max-exposure">Maximum Exposure Per Protocol (%)</Label>
                  <Input
                    id="max-exposure"
                    type="number"
                    value={yieldStrategy.maxExposurePerProtocol}
                    onChange={(e) => setYieldStrategy(prev => ({ ...prev, maxExposurePerProtocol: Number(e.target.value) }))}
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <Label>Preferred Protocols</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Joule', 'Amnis', 'Thala', 'Echelon', 'Aries'].map(protocol => (
                      <div key={protocol} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`protocol-${protocol}`}
                          checked={yieldStrategy.preferredProtocols.includes(protocol)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setYieldStrategy(prev => ({
                                ...prev,
                                preferredProtocols: [...prev.preferredProtocols, protocol]
                              }));
                            } else {
                              setYieldStrategy(prev => ({
                                ...prev,
                                preferredProtocols: prev.preferredProtocols.filter(p => p !== protocol)
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <Label htmlFor={`protocol-${protocol}`}>{protocol}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleFindYieldOpportunities} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Find Yield Opportunities
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="trading" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="trading-type">Trading Strategy Type</Label>
                  <Select
                    value={tradingStrategy.tradingType}
                    onValueChange={(value: any) => setTradingStrategy(prev => ({ ...prev, tradingType: value }))}
                  >
                    <SelectTrigger id="trading-type">
                      <SelectValue placeholder="Select strategy type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dca">Dollar-Cost Averaging</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop-loss">Stop Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source-token">Source Token</Label>
                    <Select
                      value={tradingStrategy.sourceToken}
                      onValueChange={(value: string) => setTradingStrategy(prev => ({ ...prev, sourceToken: value }))}
                    >
                      <SelectTrigger id="source-token">
                        <SelectValue placeholder="Select source token" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APT">APT</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="target-token">Target Token</Label>
                    <Select
                      value={tradingStrategy.targetToken}
                      onValueChange={(value: string) => setTradingStrategy(prev => ({ ...prev, targetToken: value }))}
                    >
                      <SelectTrigger id="target-token">
                        <SelectValue placeholder="Select target token" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APT">APT</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={tradingStrategy.amount}
                    onChange={(e) => setTradingStrategy(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                {tradingStrategy.tradingType === 'dca' && (
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={tradingStrategy.frequency || 'weekly'}
                      onValueChange={(value: string) => setTradingStrategy(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {(tradingStrategy.tradingType === 'limit' || tradingStrategy.tradingType === 'stop-loss') && (
                  <div>
                    <Label htmlFor="target-price">Target Price</Label>
                    <Input
                      id="target-price"
                      type="number"
                      value={tradingStrategy.targetPrice || 0}
                      onChange={(e) => setTradingStrategy(prev => ({ ...prev, targetPrice: Number(e.target.value) }))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
                
                <Button onClick={handleExecuteTradingStrategy} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Execute Trading Strategy
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {renderResult()}
      </CardContent>
      <CardFooter className="flex justify-between">
        {privateKey && (
          <Button variant="outline" onClick={() => setPrivateKey('')}>
            Clear Private Key
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 