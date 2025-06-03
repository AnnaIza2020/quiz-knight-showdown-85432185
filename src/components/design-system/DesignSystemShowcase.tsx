
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  Layout, 
  Zap, 
  Eye, 
  Accessibility,
  Moon,
  Sun,
  Monitor,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react';

const DesignSystemShowcase: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('dark');

  const neonColors = [
    { name: 'Neon Green', value: '#00FFA3', class: 'bg-neon-green' },
    { name: 'Neon Blue', value: '#00E0FF', class: 'bg-neon-blue' },
    { name: 'Neon Purple', value: '#8B5CF6', class: 'bg-neon-purple' },
    { name: 'Neon Pink', value: '#FF3E9D', class: 'bg-neon-pink' },
    { name: 'Neon Orange', value: '#FFA500', class: 'bg-neon-orange' },
    { name: 'Neon Red', value: '#FF0044', class: 'bg-neon-red' },
    { name: 'Neon Yellow', value: '#FFD700', class: 'bg-neon-yellow' },
  ];

  const typographyScale = [
    { name: 'Display 2XL', size: '4.5rem', class: 'text-display-2xl' },
    { name: 'Display XL', size: '3.75rem', class: 'text-display-xl' },
    { name: 'Display LG', size: '3rem', class: 'text-display-lg' },
    { name: 'Display MD', size: '2.25rem', class: 'text-display-md' },
    { name: 'Display SM', size: '1.875rem', class: 'text-display-sm' },
    { name: 'Display XS', size: '1.5rem', class: 'text-display-xs' },
  ];

  const spacingScale = [
    { name: 'xs', value: '0.125rem', pixels: '2px' },
    { name: 'sm', value: '0.25rem', pixels: '4px' },
    { name: 'md', value: '0.5rem', pixels: '8px' },
    { name: 'lg', value: '1rem', pixels: '16px' },
    { name: 'xl', value: '1.5rem', pixels: '24px' },
    { name: '2xl', value: '2rem', pixels: '32px' },
    { name: '3xl', value: '3rem', pixels: '48px' },
    { name: '4xl', value: '4rem', pixels: '64px' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-display-lg text-white mb-4 font-bold">
            Discord Game Show Design System
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive design system with neon aesthetics, dark mode support, 
            and WCAG AA accessibility compliance for the ultimate quiz show experience.
          </p>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-black/40 backdrop-blur-sm">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette size={16} />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type size={16} />
              Typography
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Layout size={16} />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Zap size={16} />
              Components
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Eye size={16} />
              Effects
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Accessibility size={16} />
              A11y
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-8">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="text-neon-green" size={24} />
                  Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Neon Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Neon Brand Colors</h3>
                  <div className="grid grid-cols-7 gap-4">
                    {neonColors.map((color) => (
                      <div key={color.name} className="text-center">
                        <div 
                          className="w-16 h-16 rounded-lg border-2 border-white/20 mb-2 mx-auto"
                          style={{ 
                            backgroundColor: color.value,
                            boxShadow: `0 0 20px ${color.value}40`
                          }}
                        />
                        <p className="text-sm text-white font-medium">{color.name}</p>
                        <p className="text-xs text-gray-400">{color.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semantic Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Semantic Colors</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-lg border-2 border-white/20 mb-2 mx-auto" />
                      <p className="text-sm text-white font-medium">Success</p>
                      <p className="text-xs text-gray-400">#00FFA3</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-500 rounded-lg border-2 border-white/20 mb-2 mx-auto" />
                      <p className="text-sm text-white font-medium">Warning</p>
                      <p className="text-xs text-gray-400">#FFD700</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500 rounded-lg border-2 border-white/20 mb-2 mx-auto" />
                      <p className="text-sm text-white font-medium">Error</p>
                      <p className="text-xs text-gray-400">#FF0044</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-lg border-2 border-white/20 mb-2 mx-auto" />
                      <p className="text-sm text-white font-medium">Info</p>
                      <p className="text-xs text-gray-400">#00E0FF</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-8">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Type className="text-neon-blue" size={24} />
                  Typography Scale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Display Sizes</h3>
                  <div className="space-y-4">
                    {typographyScale.map((type) => (
                      <div key={type.name} className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="min-w-[100px] text-neon-green border-neon-green">
                            {type.name}
                          </Badge>
                          <span className="text-sm text-gray-400">{type.size}</span>
                        </div>
                        <h4 className={`${type.class} text-white font-bold`}>
                          Game Show
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Font Families</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-gray-400 mb-2">Primary - Montserrat</p>
                      <p className="text-2xl font-montserrat text-white">
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-gray-400 mb-2">Secondary - Inter</p>
                      <p className="text-xl font-inter text-white">
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="space-y-8">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layout className="text-neon-purple" size={24} />
                  Spacing System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  {spacingScale.map((space) => (
                    <div key={space.name} className="text-center">
                      <div className="bg-neon-green mb-2 mx-auto" style={{ 
                        width: space.value, 
                        height: space.value,
                        minWidth: '8px',
                        minHeight: '8px'
                      }} />
                      <p className="text-sm text-white font-medium">{space.name}</p>
                      <p className="text-xs text-gray-400">{space.pixels}</p>
                      <p className="text-xs text-gray-500">{space.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Buttons */}
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Button Variants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button className="bg-neon-green hover:bg-neon-green/80 text-black">
                      Primary
                    </Button>
                    <Button className="bg-neon-blue hover:bg-neon-blue/80 text-black">
                      Secondary
                    </Button>
                    <Button className="bg-neon-pink hover:bg-neon-pink/80 text-white">
                      Accent
                    </Button>
                    <Button variant="outline" className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black">
                      Outline
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                      Ghost
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Sizes</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Button size="sm" className="bg-neon-green hover:bg-neon-green/80 text-black">
                        Small
                      </Button>
                      <Button className="bg-neon-green hover:bg-neon-green/80 text-black">
                        Default
                      </Button>
                      <Button size="lg" className="bg-neon-green hover:bg-neon-green/80 text-black">
                        Large
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inputs */}
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Input Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="standard" className="text-white">Standard Input</Label>
                    <Input 
                      id="standard"
                      placeholder="Enter your answer..." 
                      className="bg-black/50 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="neon" className="text-white">Neon Input</Label>
                    <Input 
                      id="neon"
                      placeholder="Neon styled input..." 
                      className="bg-black/50 border-neon-blue text-white focus:border-neon-blue focus:ring-neon-blue"
                      style={{ boxShadow: '0 0 5px rgba(0, 224, 255, 0.3)' }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Cards */}
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Card Variants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <p className="text-white text-sm">Standard Glass Card</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-neon-green/50">
                    <CardContent className="p-4">
                      <p className="text-white text-sm">Neon Gradient Card</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Status Indicators */}
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Status Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-white">Success State</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-yellow-400" size={20} />
                    <span className="text-white">Warning State</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="text-red-400" size={20} />
                    <span className="text-white">Error State</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="text-blue-400" size={20} />
                    <span className="text-white">Info State</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-8">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="text-neon-pink" size={24} />
                  Visual Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Neon Glow Effects</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 bg-neon-green rounded-lg mx-auto mb-2"
                        style={{ boxShadow: '0 0 20px #00FFA3' }}
                      />
                      <p className="text-sm text-white">Green Glow</p>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 bg-neon-blue rounded-lg mx-auto mb-2"
                        style={{ boxShadow: '0 0 20px #00E0FF' }}
                      />
                      <p className="text-sm text-white">Blue Glow</p>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 bg-neon-purple rounded-lg mx-auto mb-2"
                        style={{ boxShadow: '0 0 20px #8B5CF6' }}
                      />
                      <p className="text-sm text-white">Purple Glow</p>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 bg-neon-pink rounded-lg mx-auto mb-2"
                        style={{ boxShadow: '0 0 20px #FF3E9D' }}
                      />
                      <p className="text-sm text-white">Pink Glow</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Glass Morphism</h3>
                  <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl overflow-hidden">
                    <div className="absolute inset-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center">
                      <p className="text-white font-medium">Glass Morphism Effect</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Animations</h3>
                  <div className="flex gap-4">
                    <Button 
                      className="bg-neon-green hover:bg-neon-green/80 text-black animate-pulse"
                    >
                      Pulsing Button
                    </Button>
                    <div className="text-neon-blue text-xl font-bold animate-pulse">
                      Glowing Text
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-8">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Accessibility className="text-neon-yellow" size={24} />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">WCAG AA Compliance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                      <span className="text-white text-sm">Color contrast ratio ≥ 4.5:1</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                      <span className="text-white text-sm">Keyboard navigation support</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                      <span className="text-white text-sm">Screen reader compatibility</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                      <span className="text-white text-sm">Focus indicators</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                      <span className="text-white text-sm">Reduced motion support</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                      <span className="text-white text-sm">High contrast mode</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Focus States</h3>
                  <div className="space-y-4">
                    <Button className="bg-neon-green hover:bg-neon-green/80 text-black focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 focus:ring-offset-gray-900">
                      Focusable Button
                    </Button>
                    <Input 
                      placeholder="Focus me with Tab key" 
                      className="bg-black/50 border-white/20 text-white focus:border-neon-blue focus:ring-2 focus:ring-neon-blue"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Theme Preferences</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={currentTheme === 'light' ? 'default' : 'outline'}
                      onClick={() => setCurrentTheme('light')}
                      className="flex items-center gap-2"
                    >
                      <Sun size={16} />
                      Light
                    </Button>
                    <Button
                      variant={currentTheme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setCurrentTheme('dark')}
                      className="flex items-center gap-2"
                    >
                      <Moon size={16} />
                      Dark
                    </Button>
                    <Button
                      variant={currentTheme === 'system' ? 'default' : 'outline'}
                      onClick={() => setCurrentTheme('system')}
                      className="flex items-center gap-2"
                    >
                      <Monitor size={16} />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;
