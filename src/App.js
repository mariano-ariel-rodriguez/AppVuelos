import React, { useState, useEffect, useContext, createContext, useMemo, useCallback, memo } from 'react';
import { Search, Plane, Heart, Clock, Shield, Star, Phone, Mail, MapPin, Users, Wifi, Coffee, Car, Dog, Activity, Truck, Navigation, ChevronDown, ChevronUp, Filter, Calendar, Globe, Award, CheckCircle } from 'lucide-react';
import AIChatbot from './AIChatbot';

// Service Context
const ServiceContext = createContext();

// Custom Hooks
const useServiceMode = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error('useServiceMode must be used within ServiceProvider');
  return context;
};

const useAdvancedFilters = () => {
  const [filters, setFilters] = useState({
    priceRange: [1000, 50000],
    seatCapacity: [],
    aircraftTypes: [],
    airlines: [],
    additionalServices: []
  });

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      priceRange: [1000, 50000],
      seatCapacity: [],
      aircraftTypes: [],
      airlines: [],
      additionalServices: []
    });
  }, []);

  return { filters, updateFilter, resetFilters };
};

const useEmptyLegs = () => {
  const [emptyLegs, setEmptyLegs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchEmptyLegs = useCallback(async (filters) => {
    setIsLoading(true);
    setTimeout(() => {
      const mockEmptyLegs = [
        {
          id: 1,
          aircraft: 'Citation CJ3+',
          operator: 'Argentina Fly',
          route: { from: 'Buenos Aires', to: 'Mendoza' },
          departureDate: '2024-08-10',
          departureTime: '14:30',
          originalPrice: 12000,
          emptyLegPrice: 7200,
          discount: 40,
          availability: 'today',
          passengers: 8,
          category: 'Jet Ligero'
        },
        {
          id: 2,
          aircraft: 'King Air 350i',
          operator: 'Let\'s Fly',
          route: { from: 'Córdoba', to: 'Buenos Aires' },
          departureDate: '2024-08-11',
          departureTime: '09:15',
          originalPrice: 8500,
          emptyLegPrice: 4250,
          discount: 50,
          availability: 'tomorrow',
          passengers: 11,
          category: 'Turbohélice'
        },
        {
          id: 3,
          aircraft: 'Global 6000',
          operator: 'Elite Jets',
          route: { from: 'Bariloche', to: 'Buenos Aires' },
          departureDate: '2024-08-12',
          departureTime: '16:45',
          originalPrice: 25000,
          emptyLegPrice: 12500,
          discount: 50,
          availability: 'this-week',
          passengers: 14,
          category: 'Jet Pesado'
        }
      ];
      setEmptyLegs(mockEmptyLegs);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { emptyLegs, isLoading, searchEmptyLegs };
};

const usePriceCalculator = (route, aircraft) => {
  return useMemo(() => {
    const basePrice = aircraft?.basePrice || 5000;
    const distance = route?.distance || 500;
    const total = basePrice + (distance * 3);
    return {
      basePrice,
      distanceCost: distance * 3,
      total,
      savings: Math.round(total * 0.15)
    };
  }, [route, aircraft]);
};

// UI Components
const Button = memo(({ variant = 'primary', size = 'md', children, onClick, className = '', disabled = false }) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    medical: 'bg-red-600 hover:bg-red-700 text-white shadow-lg',
    incucai: 'bg-green-600 hover:bg-green-700 text-white shadow-lg',
    emergency: 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-xl'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
});

// Service Mode Toggle
const ServiceModeToggle = () => {
  const { currentService, setCurrentService } = useServiceMode();

  const services = [
    { id: 'executive', name: 'Ejecutivo', icon: Plane, color: 'blue' },
    { id: 'medical', name: 'Médico', icon: Heart, color: 'red' },
    { id: 'incucai', name: 'INCUCAI', icon: Activity, color: 'green' }
  ];

  return (
    <div className="flex bg-white rounded-xl p-2 shadow-lg border">
      {services.map(({ id, name, icon: Icon, color }) => (
        <button
          key={id}
          onClick={() => setCurrentService(id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
            currentService === id
              ? `bg-${color}-600 text-white shadow-md`
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Icon size={20} />
          <span className="font-semibold">{name}</span>
        </button>
      ))}
    </div>
  );
};

// Empty Legs Toggle
const EmptyLegsToggle = () => {
  const { showEmptyLegs, setShowEmptyLegs, currentService } = useServiceMode();

  if (currentService !== 'executive') return null;

  return (
    <div className="flex items-center justify-center gap-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
      <span className="text-white font-semibold">Vuelos Regulares</span>
      <button
        onClick={() => setShowEmptyLegs(!showEmptyLegs)}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in-out ${
          showEmptyLegs ? 'bg-orange-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
            showEmptyLegs ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-white font-semibold flex items-center gap-2">
        Empty Legs
        {showEmptyLegs && <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">OFERTAS</span>}
      </span>
    </div>
  );
};

// Emergency Widget
const EmergencyWidget = () => {
  const { setIsEmergencyMode, setCurrentService } = useServiceMode();

  const handleEmergencyClick = () => {
    setCurrentService('medical');
    setIsEmergencyMode(true);
    document.getElementById('search-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="emergency"
        size="lg"
        onClick={handleEmergencyClick}
        className="rounded-full w-16 h-16 shadow-2xl"
      >
        <Heart size={24} />
      </Button>
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
    </div>
  );
};

// Search Form Component
const SearchForm = () => {
  const { currentService, isEmergencyMode, showEmptyLegs } = useServiceMode();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    passengers: 1,
    urgencyLevel: 'standard',
    organType: '',
    medicalEquipment: [],
    flexibleDates: false,
    flexibleRoute: false
  });

  const handleSubmit = () => {
    console.log('Search submitted:', formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div id="search-form" className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {showEmptyLegs ? '🎯 Buscar Empty Legs' :
           isEmergencyMode ? '🚨 Emergencia Médica' : 
           currentService === 'executive' ? 'Buscar Vuelo Ejecutivo' :
           currentService === 'medical' ? 'Vuelo Sanitario' : 'Trasplante INCUCAI'}
        </h2>
        <p className="text-gray-600">
          {showEmptyLegs && 'Encuentra vuelos de reposicionamiento con hasta 50% de descuento'}
          {!showEmptyLegs && currentService === 'executive' && 'Encuentra el jet privado perfecto para tu viaje'}
          {currentService === 'medical' && 'Ambulancia aérea especializada para emergencias médicas'}
          {currentService === 'incucai' && 'Transporte urgente de órganos y tejidos - Cada minuto cuenta'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Origen</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => updateField('origin', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="CABA, Argentina"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Destino</label>
          <div className="relative">
            <Navigation className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => updateField('destination', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Destino"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {currentService === 'incucai' ? 'Fecha/Hora Urgente' : 'Fecha de vuelo'}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {currentService === 'medical' ? 'Pacientes' : 'Pasajeros'}
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={formData.passengers}
              onChange={(e) => updateField('passengers', parseInt(e.target.value))}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'persona' : 'personas'}</option>
              ))}
            </select>
          </div>
        </div>

        {currentService === 'medical' && (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nivel de Urgencia</label>
              <div className="grid grid-cols-3 gap-2">
                {['standard', 'urgent', 'critical'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateField('urgencyLevel', level)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      formData.urgencyLevel === level
                        ? level === 'critical' ? 'bg-red-600 text-white'
                          : level === 'urgent' ? 'bg-orange-500 text-white'
                          : 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level === 'standard' ? 'Estándar' : level === 'urgent' ? 'Urgente' : 'Crítico'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {currentService === 'incucai' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Órgano/Tejido</label>
            <select
              value={formData.organType}
              onChange={(e) => updateField('organType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="heart">Corazón</option>
              <option value="liver">Hígado</option>
              <option value="kidney">Riñón</option>
              <option value="lung">Pulmón</option>
              <option value="cornea">Córnea</option>
              <option value="bone">Tejido Óseo</option>
            </select>
          </div>
        )}

        {showEmptyLegs && currentService === 'executive' && (
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.flexibleDates}
                  onChange={(e) => updateField('flexibleDates', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Fechas flexibles (±3 días)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.flexibleRoute}
                  onChange={(e) => updateField('flexibleRoute', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Rutas alternativas</span>
              </label>
            </div>
          </div>
        )}

        <div className="md:col-span-full">
          <Button
            variant={showEmptyLegs ? 'primary' : 
                    currentService === 'medical' ? 'medical' : 
                    currentService === 'incucai' ? 'incucai' : 'primary'}
            size="lg"
            className={`w-full md:w-auto px-12 ${
              showEmptyLegs ? 'bg-orange-600 hover:bg-orange-700' : ''
            }`}
            onClick={handleSubmit}
          >
            <Search size={20} />
            {showEmptyLegs ? 'Buscar Empty Legs' :
             currentService === 'incucai' ? 'Buscar Vuelo Urgente' : 'Buscar Vuelos'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Empty Legs Card Component
const EmptyLegCard = memo(({ emptyLeg }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'today': return 'bg-red-100 text-red-800';
      case 'tomorrow': return 'bg-orange-100 text-orange-800';
      case 'this-week': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'today': return 'Hoy';
      case 'tomorrow': return 'Mañana';
      case 'this-week': return 'Esta semana';
      default: return 'Próximamente';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold">{emptyLeg.discount}% OFF</span>
            <div className="text-sm opacity-90">Empty Leg</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getAvailabilityColor(emptyLeg.availability)}`}>
            {getAvailabilityText(emptyLeg.availability)}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{emptyLeg.aircraft}</h3>
            <p className="text-gray-600">{emptyLeg.operator}</p>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
              {emptyLeg.category}
            </span>
          </div>
          <div className="text-right">
            <div className="text-gray-400 line-through text-sm">
              ${emptyLeg.originalPrice.toLocaleString()}
            </div>
            <div className="text-2xl font-bold text-orange-600">
              ${emptyLeg.emptyLegPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">por vuelo</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="font-bold text-lg text-gray-800">{emptyLeg.route.from}</div>
              <div className="text-sm text-gray-500">Origen</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="border-t-2 border-dashed border-gray-300 relative">
                <Plane className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500" size={20} />
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-800">{emptyLeg.route.to}</div>
              <div className="text-sm text-gray-500">Destino</div>
            </div>
          </div>
          <div className="text-center mt-3">
            <div className="font-semibold text-gray-700">
              {formatDate(emptyLeg.departureDate)} - {emptyLeg.departureTime}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span className="text-sm">Hasta {emptyLeg.passengers} pasajeros</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm">Disponible {getAvailabilityText(emptyLeg.availability).toLowerCase()}</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              Ahorrás ${(emptyLeg.originalPrice - emptyLeg.emptyLegPrice).toLocaleString()} en este vuelo
            </span>
          </div>
        </div>

        <Button variant="primary" className="w-full bg-orange-600 hover:bg-orange-700">
          Reservar Empty Leg
        </Button>
      </div>
    </div>
  );
});

// Empty Legs Section
const EmptyLegsSection = () => {
  const { emptyLegs, isLoading, searchEmptyLegs } = useEmptyLegs();
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  useEffect(() => {
    searchEmptyLegs();
  }, [searchEmptyLegs]);

  const filteredEmptyLegs = useMemo(() => {
    return emptyLegs.filter(leg => {
      const routeMatch = selectedRoute === 'all' || 
        leg.route.from.toLowerCase().includes(selectedRoute.toLowerCase()) ||
        leg.route.to.toLowerCase().includes(selectedRoute.toLowerCase());
      
      const timeMatch = selectedTimeframe === 'all' || leg.availability === selectedTimeframe;
      
      return routeMatch && timeMatch;
    });
  }, [emptyLegs, selectedRoute, selectedTimeframe]);

  const totalSavings = useMemo(() => {
    return filteredEmptyLegs.reduce((total, leg) => 
      total + (leg.originalPrice - leg.emptyLegPrice), 0
    );
  }, [filteredEmptyLegs]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Clock size={16} />
            Ofertas Limitadas
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Empty Legs - Hasta 50% de Descuento
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Aprovechá vuelos de reposicionamiento con descuentos increíbles. 
            Jets privados que vuelven vacíos a su base o se trasladan para otro pasajero.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-orange-600">{filteredEmptyLegs.length}</div>
              <div className="text-sm text-gray-600">Vuelos disponibles</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-green-600">50%</div>
              <div className="text-sm text-gray-600">Descuento promedio</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-blue-600">${totalSavings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Ahorro total disponible</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ruta</label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Todas las rutas</option>
                <option value="buenos aires">Buenos Aires</option>
                <option value="mendoza">Mendoza</option>
                <option value="córdoba">Córdoba</option>
                <option value="bariloche">Bariloche</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Disponibilidad</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Cualquier momento</option>
                <option value="today">Hoy</option>
                <option value="tomorrow">Mañana</option>
                <option value="this-week">Esta semana</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : filteredEmptyLegs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEmptyLegs.map(emptyLeg => (
              <EmptyLegCard key={emptyLeg.id} emptyLeg={emptyLeg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Clock size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay empty legs disponibles
            </h3>
            <p className="text-gray-500 mb-6">
              Ajustá tus filtros o suscribite para recibir alertas cuando aparezcan nuevas ofertas
            </p>
            <Button variant="primary" className="bg-orange-600 hover:bg-orange-700">
              Suscribirse a Alertas
            </Button>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">¿No encontrás el empty leg perfecto?</h3>
          <p className="text-lg mb-6 opacity-90">
            Configurá alertas personalizadas y te notificaremos cuando aparezcan ofertas que coincidan con tus rutas favoritas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Configurar Alertas
            </Button>
            <Button variant="primary" size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Ver Todos los Vuelos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Hero Section
const HeroSection = () => {
  const { currentService, showEmptyLegs } = useServiceMode();
  
  const heroConfig = {
    executive: {
      title: showEmptyLegs ? 'Empty Legs - Ofertas Exclusivas' : 'Vuelos Privados de Lujo',
      subtitle: showEmptyLegs ? 'Vuelos de reposicionamiento con hasta 50% de descuento' : 'Compara y reserva jets privados de todas las compañías argentinas en un solo lugar',
      image: '/api/placeholder/1200/600',
      gradient: showEmptyLegs ? 'from-orange-900 to-red-600' : 'from-blue-900 to-blue-600'
    },
    medical: {
      title: 'Ambulancia Aérea',
      subtitle: 'Transporte médico urgente con equipamiento UCI y personal especializado',
      image: '/api/placeholder/1200/600',
      gradient: 'from-red-900 to-red-600'
    },
    incucai: {
      title: 'Trasplantes INCUCAI',
      subtitle: 'Transporte urgente de órganos y tejidos - Cada minuto cuenta',
      image: '/api/placeholder/1200/600',
      gradient: 'from-green-900 to-green-600'
    }
  };

  const config = heroConfig[currentService];

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white overflow-hidden`}>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="absolute inset-0">
        <img
          src={config.image}
          alt="Hero background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="mb-6">
          <ServiceModeToggle />
        </div>
        
        <div className="mb-8">
          <EmptyLegsToggle />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {config.title}
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
          {config.subtitle}
        </p>
        
        {currentService === 'executive' && (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-lg">Aeronaves disponibles</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg">Disponibilidad</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">{showEmptyLegs ? '50%' : '15min'}</div>
              <div className="text-lg">{showEmptyLegs ? 'Descuento promedio' : 'Tiempo de respuesta'}</div>
            </div>
          </div>
        )}
        
        {currentService !== 'executive' && (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-lg">Aeronaves disponibles</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg">Disponibilidad</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">15min</div>
              <div className="text-lg">Tiempo de respuesta</div>
            </div>
          </div>
        )}

        <SearchForm />
      </div>
    </div>
  );
};

// Benefits Section (Simplified)
const BenefitsSection = () => {
  const { currentService } = useServiceMode();
  
  const benefits = {
    executive: [
      { icon: Clock, title: 'Tiempo es Dinero', description: 'Ahorra hasta 8 horas por viaje vs vuelos comerciales' },
      { icon: Shield, title: 'Privacidad Total', description: 'Tu espacio, tus reglas, máxima confidencialidad' },
      { icon: Globe, title: 'Flexibilidad', description: 'Horarios y rutas completamente personalizables' },
      { icon: Award, title: 'Servicio Premium', description: 'Chef, catering gourmet y servicios exclusivos' }
    ],
    medical: [
      { icon: Heart, title: 'Equipamiento UCI', description: 'Desfibrilador, respirador y monitoreo continuo' },
      { icon: Users, title: 'Personal Médico', description: 'Médicos y enfermeros especializados a bordo' },
      { icon: Clock, title: 'Respuesta Inmediata', description: 'Despegue en menos de 30 minutos' },
      { icon: Phone, title: 'Coordinación 24/7', description: 'Gestión integral con hospitales' }
    ],
    incucai: [
      { icon: Activity, title: 'Protocolo Urgente', description: 'Procedimientos optimizados para trasplantes' },
      { icon: Truck, title: 'Cadena de Frío', description: 'Contenedores especializados con temperatura controlada' },
      { icon: Navigation, title: 'Tracking GPS', description: 'Seguimiento en tiempo real del transporte' },
      { icon: Clock, title: 'Tiempo Crítico', description: 'Minimizamos el tiempo de isquemia' }
    ]
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {currentService === 'executive' ? 'Ventajas del Vuelo Privado' :
             currentService === 'medical' ? 'Excelencia en Emergencias Médicas' :
             'Protocolo INCUCAI Especializado'}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits[currentService].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  currentService === 'medical' ? 'bg-red-100' :
                  currentService === 'incucai' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Icon size={32} className={
                    currentService === 'medical' ? 'text-red-600' :
                    currentService === 'incucai' ? 'text-green-600' : 'text-blue-600'
                  } />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Aircraft Grid (Simplified)
const AircraftGrid = () => {
  const aircraftData = [
    {
      id: 1,
      name: 'Citation CJ3+',
      operator: 'Argentina Fly',
      category: 'Jet Ligero',
      capacity: 8,
      speed: 780,
      range: 3700,
      rating: 4.8,
      basePrice: 8500,
      amenities: ['WiFi Premium', 'Bar', 'Catering'],
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      name: 'King Air 350i',
      operator: 'Let\'s Fly',
      category: 'Turbohélice',
      capacity: 11,
      speed: 580,
      range: 2800,
      rating: 4.7,
      basePrice: 6200,
      amenities: ['WiFi', 'Catering', 'Asientos Ejecutivos'],
      image: '/api/placeholder/400/250'
    }
  ];

  const pricing = usePriceCalculator({ distance: 500 }, { basePrice: 5000 });

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestra Flota</h2>
          <p className="text-xl text-gray-600">Jets privados de lujo para ejecutivos exigentes</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aircraftData.map(aircraft => (
            <div key={aircraft.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
              <div className="relative">
                <img
                  src={aircraft.image}
                  alt={aircraft.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
                  <span className="text-sm font-semibold text-gray-800">{aircraft.category}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{aircraft.name}</h3>
                    <p className="text-gray-600">{aircraft.operator}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${pricing.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">por vuelo</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm">{aircraft.capacity} pasajeros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-400" />
                    <span className="text-sm">{aircraft.rating}/5</span>
                  </div>
                </div>

                <Button variant="primary" className="w-full">
                  Ver Detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// App Component
const App = () => {
  const [currentService, setCurrentService] = useState('executive');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [showEmptyLegs, setShowEmptyLegs] = useState(false);

  return (
    <ServiceContext.Provider value={{
      currentService,
      setCurrentService,
      isEmergencyMode,
      setIsEmergencyMode,
      showEmptyLegs,
      setShowEmptyLegs
    }}>
      <div className="min-h-screen bg-white">
        <HeroSection />
        <BenefitsSection />
        
        {showEmptyLegs && currentService === 'executive' ? (
          <EmptyLegsSection />
        ) : (
          <AircraftGrid />
        )}
        
        <EmergencyWidget />
        <AIChatbot currentService={currentService} />

      </div>
    </ServiceContext.Provider>
  );
};

export default App;