import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid, 
  Settings, 
  Plus, 
  Smartphone, 
  Wifi,
  ChevronLeft,
  MoreHorizontal,
  Mic,
  Camera,
  Bell,
  History,
  Play,
  Calendar,
  Volume2,
  VolumeX,
  Maximize2,
  Battery,
  Signal,
  Zap,
  QrCode,
  CheckCircle2,
  X,
  ChevronRight,
  Video,
  Pause,
  Download,
  Share2,
  Move,
  Filter,
  Search
} from 'lucide-react';
import { Platform, CameraDevice, ViewState, RecordingEvent } from './types';
import { analyzeCameraFrame } from './services/geminiService';

// --- Mock Data ---
const MOCK_DEVICES: CameraDevice[] = [
  {
    id: 'cam-01',
    name: 'Front Door',
    location: 'Entrance',
    status: 'online',
    thumbnailUrl: 'https://picsum.photos/800/450?random=101',
    lastActive: 'Now',
    batteryLevel: 85,
    signalStrength: 4
  },
  {
    id: 'cam-02',
    name: 'Baby Room',
    location: 'Bedroom',
    status: 'online',
    thumbnailUrl: 'https://picsum.photos/800/450?random=102',
    lastActive: 'Now',
    batteryLevel: 100,
    signalStrength: 3
  },
  {
    id: 'cam-03',
    name: 'Garage',
    location: 'Exterior',
    status: 'offline',
    thumbnailUrl: 'https://picsum.photos/800/450?random=103',
    lastActive: 'Yesterday',
    batteryLevel: 12,
    signalStrength: 1
  }
];

const MOCK_EVENTS: RecordingEvent[] = [
  { id: 'evt-1', timestamp: '14:42', duration: '0:45', type: 'person', thumbnailUrl: 'https://picsum.photos/200/150?random=201', deviceId: 'cam-01', cameraName: 'Front Door' },
  { id: 'evt-2', timestamp: '12:15', duration: '1:20', type: 'motion', thumbnailUrl: 'https://picsum.photos/200/150?random=202', deviceId: 'cam-03', cameraName: 'Garage' },
  { id: 'evt-3', timestamp: '09:30', duration: '0:30', type: 'pet', thumbnailUrl: 'https://picsum.photos/200/150?random=203', deviceId: 'cam-02', cameraName: 'Baby Room' },
  { id: 'evt-4', timestamp: '08:10', duration: '2:10', type: 'sound', thumbnailUrl: 'https://picsum.photos/200/150?random=204', deviceId: 'cam-02', cameraName: 'Baby Room' },
  { id: 'evt-5', timestamp: '03:45', duration: '0:15', type: 'motion', thumbnailUrl: 'https://picsum.photos/200/150?random=205', deviceId: 'cam-01', cameraName: 'Front Door' },
  { id: 'evt-6', timestamp: 'Yesterday', duration: '0:22', type: 'person', thumbnailUrl: 'https://picsum.photos/200/150?random=206', deviceId: 'cam-01', cameraName: 'Front Door' },
  { id: 'evt-7', timestamp: 'Yesterday', duration: '1:05', type: 'motion', thumbnailUrl: 'https://picsum.photos/200/150?random=207', deviceId: 'cam-03', cameraName: 'Garage' },
];

// --- Components ---

const StatusBar: React.FC<{ platform: Platform }> = ({ platform }) => {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex justify-between items-center px-6 py-1 text-xs font-medium z-50 select-none ${platform === 'ios' ? 'h-[44px] text-white' : 'h-[32px] bg-black text-white'}`}>
      <span className="w-20">{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} />
        <span className="text-[10px]">WiFi</span>
        <Battery size={18} />
      </div>
    </div>
  );
};

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; platform: Platform }> = ({ checked, onChange, platform }) => (
  <div 
    onClick={onChange}
    className={`w-12 h-7 rounded-full relative transition-colors duration-300 cursor-pointer ${
      checked 
        ? (platform === 'ios' ? 'bg-ios-blue' : 'bg-android-green') 
        : 'bg-gray-600'
    }`}
  >
    <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </div>
);

// --- Views ---

const Dashboard: React.FC<{ 
  platform: Platform; 
  devices: CameraDevice[]; 
  onSelect: (id: string) => void;
  onAdd: () => void;
}> = ({ platform, devices, onSelect, onAdd }) => {
  return (
    <div className="pb-24 pt-2 h-full overflow-y-auto">
      {/* Header */}
      <div className={`px-5 mb-6 flex justify-between items-end ${platform === 'android' ? 'mt-4' : ''}`}>
        <div>
          {platform === 'android' && <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">SecureView Home</p>}
          <h1 className={`text-2xl font-bold ${platform === 'ios' ? 'text-center' : 'text-left'}`}>My Devices</h1>
        </div>
        <button 
          onClick={onAdd} 
          className={`p-2 rounded-full active:scale-90 transition-transform ${platform === 'ios' ? 'bg-gray-800 text-blue-500' : 'bg-android-green text-black shadow-lg shadow-green-900/20'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Device List */}
      <div className="space-y-4 px-4">
        {devices.map(device => (
          <div 
            key={device.id} 
            onClick={() => onSelect(device.id)}
            className={`
              relative overflow-hidden rounded-2xl bg-gray-900 border active:scale-[0.98] transition-all duration-200 cursor-pointer group
              ${platform === 'ios' ? 'border-gray-800' : 'border-gray-800 shadow-md'}
            `}
          >
            {/* Status Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : device.status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="font-medium text-xs text-white">{device.status === 'online' ? 'Live' : device.status}</span>
            </div>

            {/* Connection Speed Mock */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 text-[10px] text-white/80 bg-black/40 px-2 py-1 rounded-md">
               <Wifi size={10} />
               <span>{device.status === 'online' ? '128 KB/s' : '0 KB/s'}</span>
            </div>

            {/* Thumbnail */}
            <div className="aspect-video relative bg-gray-800">
               <img src={device.thumbnailUrl} alt={device.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30">
                    <Play fill="white" size={24} className="ml-1 text-white" />
                  </div>
               </div>
            </div>

            {/* Info */}
            <div className="p-4 flex justify-between items-center bg-gray-900/90 backdrop-blur-xl">
               <div>
                  <h3 className="font-semibold text-white">{device.name}</h3>
                  <p className="text-xs text-gray-400">{device.location}</p>
               </div>
               <ChevronRight size={20} className="text-gray-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsView: React.FC<{
  platform: Platform;
  onSelectEvent: (event: RecordingEvent) => void;
}> = ({ platform, onSelectEvent }) => {
  const [filter, setFilter] = useState<'all' | 'person' | 'motion'>('all');
  
  const filteredEvents = MOCK_EVENTS.filter(e => filter === 'all' || e.type === filter);

  return (
    <div className="h-full bg-black flex flex-col pb-24">
      {/* Header */}
      <div className={`px-5 py-4 border-b border-gray-800 flex justify-between items-end ${platform === 'android' ? 'mt-4' : ''}`}>
        <div>
           <h1 className="text-2xl font-bold">Activity</h1>
           <p className="text-xs text-gray-400 mt-1">Recent alerts from your system</p>
        </div>
        <button className="p-2 bg-gray-900 rounded-full text-gray-400">
           <Search size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 px-5 py-4 overflow-x-auto no-scrollbar">
         {['all', 'person', 'motion', 'sound', 'pet'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`
                px-4 py-2 rounded-full text-xs font-medium capitalize transition-colors
                ${filter === f 
                  ? (platform === 'ios' ? 'bg-white text-black' : 'bg-android-green text-black') 
                  : 'bg-gray-900 text-gray-400 border border-gray-800'}
              `}
            >
               {f}
            </button>
         ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
         {filteredEvents.map((evt) => (
            <div 
               key={evt.id}
               onClick={() => onSelectEvent(evt)}
               className="flex gap-4 p-3 bg-gray-900/50 rounded-xl border border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors active:scale-[0.98]"
            >
               {/* Thumbnail */}
               <div className="relative w-24 h-16 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                  <img src={evt.thumbnailUrl} className="w-full h-full object-cover" alt="event" />
                  <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[10px] font-mono">
                     {evt.timestamp}
                  </div>
               </div>

               {/* Info */}
               <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                     <h3 className="font-semibold text-sm capitalize text-white flex items-center gap-2">
                        {evt.type === 'person' && <span className="text-blue-400">Person Detected</span>}
                        {evt.type === 'motion' && <span className="text-orange-400">Motion Detected</span>}
                        {evt.type === 'pet' && <span className="text-yellow-400">Pet Detected</span>}
                        {evt.type === 'sound' && <span className="text-purple-400">Sound Detected</span>}
                     </h3>
                     <ChevronRight size={16} className="text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{evt.cameraName || 'Unknown Camera'}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{evt.duration} recorded</p>
               </div>
            </div>
         ))}
         
         <div className="py-8 text-center text-gray-600 text-xs">
            End of recent history
         </div>
      </div>
    </div>
  );
};

const LiveView: React.FC<{
  platform: Platform;
  device: CameraDevice;
  onBack: () => void;
  onPlayback: () => void;
}> = ({ platform, device, onBack, onPlayback }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isTalkActive, setIsTalkActive] = useState(false);
  const [quality, setQuality] = useState('HD');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bitrate, setBitrate] = useState(120);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Simulate bitrate fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setBitrate(prev => Math.max(50, Math.min(250, prev + (Math.random() * 40 - 20))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAiAnalyze = async () => {
    if (!videoRef.current) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];

    const result = await analyzeCameraFrame(base64);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Floating Header */}
      <div className="absolute top-10 left-0 right-0 z-20 px-4 flex items-center justify-between pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3 pointer-events-auto">
           <button onClick={() => setQuality(q => q === 'HD' ? 'SD' : 'HD')} className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-xs font-bold border border-white/10">
             {quality}
           </button>
           <button className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60">
             <Settings size={20} />
           </button>
        </div>
      </div>

      {/* Main Video Feed */}
      <div className="relative w-full bg-gray-900 aspect-[4/3] sm:aspect-video mt-0 flex items-center justify-center overflow-hidden group">
         <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay 
            muted={isMuted} 
            loop 
            playsInline
            src="https://assets.mixkit.co/videos/preview/mixkit-living-room-with-a-fireplace-and-a-christmas-tree-41675-large.mp4"
          />
         
         {/* OSD Overlays */}
         <div className="absolute top-4 right-4 flex flex-col items-end gap-1 opacity-70 text-[10px] font-mono shadow-sm">
            <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
            <span>{Math.floor(bitrate)} KB/s</span>
         </div>

         {/* PTZ Controls Overlay (Only visible on hover/tap) */}
         <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-24 h-24 bg-black/20 backdrop-blur-sm rounded-full relative border border-white/10">
               <div className="absolute top-1 left-1/2 -translate-x-1/2"><ChevronLeft className="rotate-90 w-4 h-4" /></div>
               <div className="absolute bottom-1 left-1/2 -translate-x-1/2"><ChevronLeft className="-rotate-90 w-4 h-4" /></div>
               <div className="absolute left-1 top-1/2 -translate-y-1/2"><ChevronLeft className="w-4 h-4" /></div>
               <div className="absolute right-1 top-1/2 -translate-y-1/2"><ChevronLeft className="rotate-180 w-4 h-4" /></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Move size={16} className="opacity-50" />
               </div>
            </div>
         </div>

         {/* Volume / Fullscreen Controls */}
         <div className="absolute bottom-4 right-4 flex gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-black/50 rounded-full">
               {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button className="p-2 bg-black/50 rounded-full">
               <Maximize2 size={16} />
            </button>
         </div>

         {/* AI Overlay */}
         {(isAnalyzing || aiAnalysis) && (
           <div className="absolute top-16 left-4 right-4 bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-white/10 animate-slide-up z-10">
              <div className="flex gap-3">
                 <div className="p-2 bg-indigo-500 rounded-lg h-fit">
                    <Zap size={16} className="text-white" fill="currentColor" />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-indigo-300 text-xs mb-1 uppercase tracking-wider">Gemini Vision</h3>
                    {isAnalyzing ? (
                      <p className="text-xs text-gray-300 animate-pulse">Analyzing frame...</p>
                    ) : (
                      <p className="text-xs text-white leading-relaxed">{aiAnalysis}</p>
                    )}
                 </div>
                 {aiAnalysis && (
                   <button onClick={() => setAiAnalysis(null)} className="h-fit p-1 text-gray-400 hover:text-white"><X size={14} /></button>
                 )}
              </div>
           </div>
         )}
      </div>

      {/* Controls Area */}
      <div className="flex-1 bg-gray-900 relative z-10 flex flex-col">
         {/* Toolbar */}
         <div className="grid grid-cols-5 gap-1 p-4 border-b border-gray-800">
            <button onClick={handleAiAnalyze} className="flex flex-col items-center gap-1 py-2 rounded-lg active:bg-gray-800">
               <Zap size={20} className="text-indigo-400" />
               <span className="text-[10px] text-gray-400">AI Detect</span>
            </button>
            <button onClick={onPlayback} className="flex flex-col items-center gap-1 py-2 rounded-lg active:bg-gray-800">
               <History size={20} className="text-white" />
               <span className="text-[10px] text-gray-400">History</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 rounded-lg active:bg-gray-800">
               <Camera size={20} className="text-white" />
               <span className="text-[10px] text-gray-400">Snap</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 rounded-lg active:bg-gray-800">
               <Video size={20} className="text-white" />
               <span className="text-[10px] text-gray-400">Record</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 rounded-lg active:bg-gray-800">
               <Bell size={20} className="text-white" />
               <span className="text-[10px] text-gray-400">Alarm</span>
            </button>
         </div>

         {/* Main Interaction Area (2-Way Audio) */}
         <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900">
            <div className="relative">
               {/* Ripple Effect */}
               {isTalkActive && (
                  <>
                     <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping" />
                     <div className="absolute -inset-4 bg-green-500 rounded-full opacity-10 animate-pulse" />
                  </>
               )}
               
               <button 
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-200
                    ${isTalkActive 
                      ? 'bg-green-500 scale-110' 
                      : (platform === 'ios' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-android-green hover:bg-green-400')
                    }
                  `}
                  onMouseDown={() => setIsTalkActive(true)}
                  onMouseUp={() => setIsTalkActive(false)}
                  onTouchStart={(e) => { e.preventDefault(); setIsTalkActive(true); }}
                  onTouchEnd={(e) => { e.preventDefault(); setIsTalkActive(false); }}
               >
                  <Mic size={32} className={`text-white ${isTalkActive ? 'animate-bounce' : ''}`} fill={isTalkActive ? 'white' : 'none'} />
               </button>
            </div>
            
            <p className="mt-6 font-medium text-gray-300 transition-all min-h-[24px]">
               {isTalkActive ? (
                 <span className="flex items-center gap-2 text-green-400">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                   Transmitting Audio...
                 </span>
               ) : 'Hold to Talk'}
            </p>

            {/* Audio Visualizer Lines (Decorative) */}
            <div className="h-12 flex items-end justify-center gap-1 mt-4 w-full max-w-[200px]">
               {[...Array(15)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-1.5 rounded-t-sm transition-all duration-100 ${isTalkActive ? 'bg-green-500/80' : 'bg-gray-800'}`}
                    style={{ 
                       height: isTalkActive ? `${Math.max(20, Math.random() * 100)}%` : '4px' 
                    }}
                  />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const PlaybackView: React.FC<{ 
  platform: Platform; 
  onBack: () => void;
  initialTime?: string;
}> = ({ platform, onBack, initialTime }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Timeline Logic
  const [timeOffset, setTimeOffset] = useState(0); // Pixels
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentOffset = useRef(0);

  // Generate current displayed time based on offset
  // Assumption: 100 pixels = 1 hour
  const baseTime = 14 * 60 + 42; // 14:42 in minutes

  // Helper to calculate offset from time string "HH:MM"
  const calculateOffsetFromTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const targetMinutes = h * 60 + m;
    // Reverse the formula: displayedMinutes = baseTime - (offset / 100) * 60
    // offset = (baseTime - targetMinutes) / 0.6
    return (baseTime - targetMinutes) / 0.6;
  };

  useEffect(() => {
    if (initialTime) {
      setTimeOffset(calculateOffsetFromTime(initialTime));
    }
  }, [initialTime]);

  const getDisplayTime = (offset: number) => {
    const displayedMinutes = baseTime - (offset / 100) * 60;
    const displayDate = new Date();
    displayDate.setHours(Math.floor(displayedMinutes / 60));
    displayDate.setMinutes(Math.floor(displayedMinutes % 60));
    displayDate.setSeconds(0);
    return displayDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const timeString = getDisplayTime(timeOffset);

  // Function to jump to a specific timestamp from an event
  const jumpToTime = (timeStr: string) => {
    setTimeOffset(calculateOffsetFromTime(timeStr));
  };


  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    currentOffset.current = timeOffset;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return;
    const delta = clientX - startX.current;
    // Limit scrolling somewhat
    const newOffset = currentOffset.current + delta;
    setTimeOffset(newOffset);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const dates = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  // Filter events for display in playback list (just random mock subset or all)
  const playbackEvents = MOCK_EVENTS.slice(0, 5);

  return (
    <div 
      className="h-full bg-gray-900 flex flex-col select-none"
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      {/* Header */}
      <div className={`px-4 py-3 flex items-center gap-4 bg-gray-900 border-b border-gray-800 z-20`}>
        <button onClick={onBack} className="p-1"><ChevronLeft /></button>
        <div className="flex-1 text-center pr-8">
          <h2 className="font-semibold text-sm">History</h2>
          <p className="text-[10px] text-gray-400">{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <Calendar size={20} className="text-gray-400" />
      </div>

      {/* Video Player */}
      <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
        <video 
           className="w-full h-full object-cover opacity-80"
           src="https://assets.mixkit.co/videos/preview/mixkit-living-room-with-a-fireplace-and-a-christmas-tree-41675-large.mp4"
           autoPlay={isPlaying}
           loop
           muted
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
             <Play size={48} fill="white" className="text-white opacity-80" />
          </div>
        )}
        
        {/* Overlay Time */}
        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-mono">
           {timeString}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-2 flex justify-center items-center gap-8 border-b border-gray-800">
         <button className="text-gray-400 hover:text-white"><Share2 size={20} /></button>
         <button className="text-gray-400 hover:text-white"><Camera size={20} /></button>
         <button 
           onClick={() => setIsPlaying(!isPlaying)}
           className={`p-3 rounded-full text-black ${platform === 'ios' ? 'bg-ios-blue text-white' : 'bg-android-green'}`}
         >
            {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
         </button>
         <button className="text-gray-400 hover:text-white"><Download size={20} /></button>
         <button className="text-gray-400 hover:text-white"><Maximize2 size={20} /></button>
      </div>

      {/* Draggable Timeline UI */}
      <div 
        className="h-24 bg-gray-800 relative overflow-hidden cursor-grab active:cursor-grabbing border-b border-gray-700 touch-none"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      >
         {/* Ruler Marks Container */}
         <div 
            className="absolute inset-y-0 flex items-end left-1/2"
            style={{ transform: `translateX(${timeOffset}px)` }}
         >
            {/* Generate a wide range of ruler marks */}
            {/* Shift left by half width to center 0 */}
            <div className="flex -translate-x-1/2">
              {[...Array(100)].map((_, i) => {
                 const hour = Math.floor(i / 4); // Every 4th is an hour
                 const isHour = i % 4 === 0;
                 return (
                   <div key={i} className="flex flex-col items-center justify-end w-[25px] gap-1 opacity-60 shrink-0">
                      <div className={`w-0.5 bg-gray-400 ${isHour ? 'h-8' : 'h-4'}`} />
                      {isHour && <span className="text-[10px] text-gray-300 select-none">{hour % 24}:00</span>}
                   </div>
                 );
              })}
            </div>
            
            {/* Blue Activity Blocks - Positioned relative to the ruler */}
            <div className="absolute top-8 left-[0px] w-[100px] h-4 bg-blue-500/50 rounded-sm border border-blue-400 pointer-events-none" />
            <div className="absolute top-8 left-[200px] w-[300px] h-4 bg-blue-500/50 rounded-sm border border-blue-400 pointer-events-none" />
         </div>
         
         {/* Center Scrubber Line (Static) */}
         <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500 z-10 shadow-[0_0_8px_red] pointer-events-none" />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-1 rounded-b pointer-events-none">
            {timeString.slice(0, 5)}
         </div>
      </div>

      {/* Calendar Strip */}
      <div className="flex items-center justify-between p-4 overflow-x-auto no-scrollbar border-b border-gray-800">
         {dates.map((date, i) => {
           const isSelected = date.getDate() === selectedDate.getDate();
           return (
             <div 
               key={i} 
               onClick={() => setSelectedDate(date)}
               className={`flex flex-col items-center min-w-[45px] py-2 rounded-lg cursor-pointer ${isSelected ? 'bg-gray-700' : ''}`}
             >
               <span className="text-[10px] text-gray-400">{date.toLocaleDateString('en-US', {weekday: 'short'})}</span>
               <span className={`font-bold text-sm ${isSelected ? (platform === 'ios' ? 'text-blue-400' : 'text-android-green') : 'text-white'}`}>
                 {date.getDate()}
               </span>
             </div>
           );
         })}
      </div>

      {/* Event List */}
      <div className="flex-1 overflow-y-auto bg-gray-900">
         <div className="p-4 space-y-4">
            {playbackEvents.map((evt) => (
               <div 
                 key={evt.id} 
                 onClick={() => jumpToTime(evt.timestamp)} 
                 className="flex gap-4 group cursor-pointer active:opacity-70 transition-colors hover:bg-gray-800/50 p-2 -mx-2 rounded-lg"
               >
                  <div className="w-12 text-right pt-1">
                     <span className="text-sm font-mono text-gray-400 group-hover:text-blue-400 transition-colors">{evt.timestamp}</span>
                  </div>
                  <div className="relative pt-2">
                     <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-gray-900 z-10 relative" />
                     <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-800 -z-0" />
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-lg p-2 flex gap-3 border border-gray-700 group-hover:border-gray-600 transition-colors">
                     <img src={evt.thumbnailUrl} className="w-20 h-14 object-cover rounded bg-gray-900" alt="thumb" />
                     <div className="flex flex-col justify-center">
                        <span className="text-sm font-medium text-white capitalize">{evt.type} Detected</span>
                        <span className="text-xs text-gray-500">{evt.duration} • Motion</span>
                     </div>
                     <div className="ml-auto flex items-center pr-2">
                        <div className="p-1.5 rounded-full bg-gray-700 text-gray-400 group-hover:text-white group-hover:bg-gray-600 transition-colors">
                           <Play size={14} fill="currentColor" />
                        </div>
                     </div>
                  </div>
               </div>
            ))}
            <div className="h-8" /> {/* Padding bottom */}
         </div>
      </div>
    </div>
  );
};

const SetupWizard: React.FC<{ platform: Platform; onComplete: () => void; onCancel: () => void }> = ({ platform, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [wifiSSID, setWifiSSID] = useState('Home_WiFi_5G');
  const [wifiPass, setWifiPass] = useState('');

  // Step 1: Select
  // Step 2: Power Check
  // Step 3: WiFi Input
  // Step 4: QR Scan (Phone shows QR, Camera scans)
  // Step 5: Connecting

  const next = () => setStep(s => s + 1);

  // Auto-advance logic for Step 5
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 5) {
      timer = setTimeout(() => {
        onComplete();
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step, onComplete]);

  return (
    <div className="h-full bg-black flex flex-col relative">
       <div className="px-4 py-4 flex items-center border-b border-gray-900">
         <button onClick={onCancel}><ChevronLeft /></button>
         <span className="ml-4 font-semibold">Add Device</span>
       </div>

       <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold mb-2">Select Model</h2>
              <p className="text-gray-400 mb-8 text-sm">Choose the device you want to set up.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={next} className="p-4 bg-gray-900 rounded-xl flex flex-col items-center gap-3 hover:bg-gray-800 border border-gray-800 hover:border-blue-500 transition-all">
                   <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"><Camera size={24} /></div>
                   <span className="text-sm font-medium">Pro Camera</span>
                </button>
                <button onClick={next} className="p-4 bg-gray-900 rounded-xl flex flex-col items-center gap-3 hover:bg-gray-800 border border-gray-800 hover:border-blue-500 transition-all">
                   <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"><Video size={24} /></div>
                   <span className="text-sm font-medium">Doorbell</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center text-center animate-slide-up">
              <div className="w-48 h-48 bg-gray-900 rounded-full flex items-center justify-center mb-8 relative">
                 <Camera size={64} className="text-gray-500" />
                 <div className="absolute bottom-10 right-12 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                 <div className="absolute bottom-10 right-12 w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <h2 className="text-xl font-bold mb-2">Reset Device</h2>
              <p className="text-gray-400 mb-8 text-sm px-4">Power on the device and hold the reset button for 5 seconds until the indicator flashes red.</p>
              <label className="flex items-center gap-3 mb-8 p-4 bg-gray-900 rounded-lg w-full text-left">
                <input type="checkbox" className="w-5 h-5 rounded bg-gray-800" />
                <span className="text-sm">I see the red light flashing</span>
              </label>
              <button onClick={next} className={`w-full py-3.5 rounded-xl font-semibold ${platform === 'ios' ? 'bg-ios-blue' : 'bg-android-green text-black'}`}>Next</button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-up">
               <h2 className="text-xl font-bold mb-2">WiFi Configuration</h2>
               <p className="text-gray-400 mb-8 text-sm">Select a 2.4GHz Wi-Fi network for the camera.</p>
               
               <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-xs text-gray-500 ml-1 mb-1 block">Network Name</label>
                    <div className="flex items-center bg-gray-900 rounded-xl px-4 py-3 border border-gray-800">
                       <Wifi size={20} className="text-gray-400 mr-3" />
                       <input 
                         type="text" 
                         value={wifiSSID} 
                         onChange={(e) => setWifiSSID(e.target.value)}
                         className="bg-transparent flex-1 outline-none text-white placeholder-gray-600"
                       />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 ml-1 mb-1 block">Password</label>
                    <div className="flex items-center bg-gray-900 rounded-xl px-4 py-3 border border-gray-800">
                       <div className="w-5 mr-3" />
                       <input 
                         type="password" 
                         value={wifiPass} 
                         onChange={(e) => setWifiPass(e.target.value)}
                         placeholder="Enter WiFi Password"
                         className="bg-transparent flex-1 outline-none text-white placeholder-gray-600"
                       />
                    </div>
                  </div>
               </div>

               <button onClick={next} className={`w-full py-3.5 rounded-xl font-semibold ${platform === 'ios' ? 'bg-ios-blue' : 'bg-android-green text-black'}`}>Generate QR Code</button>
            </div>
          )}

          {step === 4 && (
             <div className="flex flex-col items-center text-center animate-slide-up h-full">
                <h2 className="text-xl font-bold mb-2">Scan with Camera</h2>
                <p className="text-gray-400 mb-6 text-sm px-8">Show this QR code to the camera lens from 6-8 inches away.</p>
                
                <div className="bg-white p-4 rounded-xl mb-8">
                   <QrCode size={180} className="text-black" />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-blue-400 mb-auto cursor-pointer hover:text-blue-300" onClick={next}>
                   <Volume2 size={16} />
                   <span>I heard a prompt sound</span>
                </div>
             </div>
          )}

          {step === 5 && (
             <div className="flex flex-col items-center justify-center h-full animate-slide-up">
               <div className="relative mb-8">
                 <div className="w-24 h-24 rounded-full border-4 border-gray-800 flex items-center justify-center bg-gray-900">
                    <Wifi size={32} className="text-blue-500 animate-pulse" />
                 </div>
                 <div className="absolute -inset-2 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
               </div>
               <h2 className="text-xl font-bold mb-2">Connecting...</h2>
               <p className="text-gray-400 text-sm mb-8">Keep your phone close to the device.</p>
               
               <div className="w-full max-w-xs space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                     <CheckCircle2 size={16} className="text-green-500" />
                     <span>Device found</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                     <CheckCircle2 size={16} className="text-green-500" />
                     <span>Registering to cloud</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-50">
                     <div className="w-4 h-4 border-2 border-white/50 rounded-full animate-spin" />
                     <span>Initializing...</span>
                  </div>
               </div>
             </div>
          )}
       </div>
    </div>
  );
};

// --- Main App Logic ---

export default function App() {
  const [platform, setPlatform] = useState<Platform>('ios');
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedDevice, setSelectedDevice] = useState<CameraDevice | null>(null);
  const [devices, setDevices] = useState<CameraDevice[]>(MOCK_DEVICES);
  const [showTabbar, setShowTabbar] = useState(true);
  const [playbackTime, setPlaybackTime] = useState<string | undefined>(undefined);
  
  // Track navigation history to return to the correct screen
  const previousView = useRef<ViewState>('dashboard');

  // Navigation Handlers
  const handleDeviceSelect = (id: string) => {
    const dev = devices.find(d => d.id === id);
    if (dev) {
      setSelectedDevice(dev);
      previousView.current = 'dashboard';
      setCurrentView('live');
      setShowTabbar(false);
    }
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setShowTabbar(true);
  };

  const handleDeviceAdded = () => {
    setDevices([...devices, {
       id: `cam-${Date.now()}`,
       name: 'New Camera',
       location: 'Living Room',
       status: 'online',
       thumbnailUrl: 'https://picsum.photos/800/450?random=99',
       lastActive: 'Just now',
       batteryLevel: 100
    }]);
    handleBack();
  };

  // Render Content based on View State
  const renderContent = () => {
    switch (currentView) {
      case 'live':
        return selectedDevice ? (
          <LiveView 
            platform={platform} 
            device={selectedDevice} 
            onBack={handleBack}
            onPlayback={() => {
              previousView.current = 'live';
              setPlaybackTime(undefined);
              setCurrentView('playback');
            }}
          />
        ) : null;
      case 'events':
        return (
           <EventsView 
             platform={platform}
             onSelectEvent={(evt) => {
               const dev = devices.find(d => d.id === evt.deviceId) || devices[0];
               setSelectedDevice(dev);
               setPlaybackTime(evt.timestamp);
               previousView.current = 'events';
               setCurrentView('playback');
               setShowTabbar(false);
             }}
           />
        );
      case 'playback':
        return <PlaybackView 
          platform={platform} 
          initialTime={playbackTime}
          onBack={() => {
             setCurrentView(previousView.current);
             if (previousView.current === 'dashboard' || previousView.current === 'events') {
                setShowTabbar(true);
             }
          }} 
        />;
      case 'setup':
        return <SetupWizard platform={platform} onComplete={handleDeviceAdded} onCancel={handleBack} />;
      case 'settings':
        return (
           <div className="p-6 pt-12 bg-black h-full">
              <div className="flex items-center mb-8">
                 <button onClick={handleBack}><ChevronLeft /></button>
                 <h2 className="text-2xl font-bold ml-4">Settings</h2>
              </div>
              
              <div className="space-y-6">
                 <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-lg ${platform === 'ios' ? 'bg-ios-blue' : 'bg-android-green'}`}>
                          <Smartphone size={20} className={platform === 'ios' ? 'text-white' : 'text-black'} />
                       </div>
                       <div>
                          <p className="font-medium">Platform Style</p>
                          <p className="text-xs text-gray-400">Current: {platform === 'ios' ? 'iOS (Apple)' : 'Android (Material)'}</p>
                       </div>
                    </div>
                    <ToggleSwitch 
                      checked={platform === 'android'} 
                      onChange={() => setPlatform(p => p === 'ios' ? 'android' : 'ios')}
                      platform={platform}
                    />
                 </div>

                 <div className="bg-gray-900 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-300">Push Notifications</span>
                       <ToggleSwitch checked={true} onChange={() => {}} platform={platform} />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-300">Cellular Data Usage</span>
                       <ToggleSwitch checked={false} onChange={() => {}} platform={platform} />
                    </div>
                 </div>

                 <div className="bg-gray-900 rounded-2xl p-4">
                    <button className="w-full py-3 text-red-500 font-medium">Sign Out</button>
                 </div>
              </div>
           </div>
        );
      default:
        return <Dashboard platform={platform} devices={devices} onSelect={handleDeviceSelect} onAdd={() => { setCurrentView('setup'); setShowTabbar(false); }} />;
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-neutral-900 overflow-hidden">
      {/* Device Frame */}
      <div className={`
         relative w-full h-full sm:w-[375px] sm:h-[812px] bg-black sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col
         ${platform === 'ios' ? 'font-sans' : 'font-sans'} 
         border-8 border-gray-800 sm:border-[14px] transition-all duration-500
      `}>
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-800 rounded-b-2xl z-[60] hidden sm:block pointer-events-none" />

        <StatusBar platform={platform} />

        {/* View Container */}
        <div className="flex-1 relative bg-black text-white overflow-hidden">
           {renderContent()}
        </div>

        {/* Bottom Tab Bar */}
        {showTabbar && (
          <div className={`
             flex justify-around items-center px-2 z-50
             ${platform === 'ios' 
               ? 'h-[83px] pb-5 bg-ios-surface backdrop-blur-lg border-t border-white/10' 
               : 'h-[64px] bg-android-surface border-t border-gray-800'}
          `}>
             <button className={`flex flex-col items-center gap-1 p-2 w-16 ${currentView === 'dashboard' ? (platform === 'ios' ? 'text-ios-blue' : 'text-android-green') : 'text-gray-500'}`} onClick={() => setCurrentView('dashboard')}>
                <LayoutGrid size={24} />
                <span className="text-[10px]">Home</span>
             </button>
             <button 
               onClick={() => {
                 previousView.current = 'dashboard';
                 setCurrentView('events');
                 setShowTabbar(true);
               }}
               className={`flex flex-col items-center gap-1 p-2 w-16 ${currentView === 'events' ? (platform === 'ios' ? 'text-ios-blue' : 'text-android-green') : 'text-gray-500'}`}
             >
                <History size={24} />
                <span className="text-[10px]">Events</span>
             </button>
             <button className={`flex flex-col items-center gap-1 p-2 w-16 ${currentView === 'settings' ? (platform === 'ios' ? 'text-ios-blue' : 'text-android-green') : 'text-gray-500'}`} onClick={() => setCurrentView('settings')}>
                <Settings size={24} />
                <span className="text-[10px]">Settings</span>
             </button>
          </div>
        )}
        
        {/* iOS Home Indicator */}
        {platform === 'ios' && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white rounded-full z-[60] opacity-50 pointer-events-none" />
        )}
      </div>

      {/* Desktop Instructions */}
      <div className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2 text-white w-72 animate-slide-up">
         <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">SecureView Pro</h1>
         <p className="text-gray-400 mb-8 leading-relaxed">Professional grade security interface simulation.</p>
         
         <div className="space-y-4">
            <div className="flex gap-4 items-start">
               <div className="p-2 bg-gray-800 rounded-lg"><Smartphone size={20} /></div>
               <div>
                  <h4 className="font-bold">Dual Platform</h4>
                  <p className="text-xs text-gray-500">Toggle between iOS and Android styles in settings.</p>
               </div>
            </div>
            <div className="flex gap-4 items-start">
               <div className="p-2 bg-gray-800 rounded-lg"><Wifi size={20} /></div>
               <div>
                  <h4 className="font-bold">Smart Pairing</h4>
                  <p className="text-xs text-gray-500">Full QR code pairing workflow simulation.</p>
               </div>
            </div>
            <div className="flex gap-4 items-start">
               <div className="p-2 bg-gray-800 rounded-lg"><History size={20} /></div>
               <div>
                  <h4 className="font-bold">Timeline Playback</h4>
                  <p className="text-xs text-gray-500">Drag to seek historical footage.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}