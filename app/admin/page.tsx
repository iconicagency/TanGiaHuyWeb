'use client';

import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { LogIn, LogOut, Plus, Trash2, Save, Image as ImageIcon, Layout, Settings, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper for handleFirestoreError is required by instructions
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We can show a toast or alert here in a real app
}

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hero' | 'collections' | 'projects' | 'news' | 'contact'>('hero');
  
  // Data states
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<any>(null);
  const [collectionSlides, setCollectionSlides] = useState<any[]>([]);
  const [projectSlides, setProjectSlides] = useState<any[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    console.log("Auth checking...");
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      console.log("User detected:", u ? u.email : "none");
    });
    // Auto-login or just stay as is. User wants "vào luôn"
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Real-time listeners
    const unsubHero = onSnapshot(query(collection(db, 'hero_slides'), orderBy('order')), 
      (snap) => setHeroSlides(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'hero_slides')
    );

    const unsubHeroSettings = onSnapshot(doc(db, 'settings', 'hero'), 
      (snap) => setHeroSettings(snap.exists() ? snap.data() : null),
      (err) => handleFirestoreError(err, OperationType.GET, 'settings/hero')
    );

    const unsubCollections = onSnapshot(query(collection(db, 'collection_slides'), orderBy('order')), 
      (snap) => setCollectionSlides(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'collection_slides')
    );

    const unsubProjects = onSnapshot(query(collection(db, 'project_slides'), orderBy('order')), 
      (snap) => setProjectSlides(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'project_slides')
    );

    const unsubNews = onSnapshot(collection(db, 'news_items'), 
      (snap) => setNewsItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'news_items')
    );

    const unsubContact = onSnapshot(doc(db, 'contact', 'info'), 
      (snap) => setContactInfo(snap.exists() ? snap.data() : null),
      (err) => handleFirestoreError(err, OperationType.GET, 'contact/info')
    );

    return () => {
      unsubHero();
      unsubHeroSettings();
      unsubCollections();
      unsubProjects();
      unsubNews();
      unsubContact();
    };
  }, [user]);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to avoid auto-login with wrong account
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login error:", error);
      let message = "Đã có lỗi xảy ra khi đăng nhập.";
      if (error.code === 'auth/unauthorized-domain') {
        message = "Tên miền hiện tại (" + window.location.hostname + ") chưa được ủy quyền trong Firebase Auth Console. Hãy thêm nó vào phần 'Authorized Domains'.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = "Cửa sổ đăng nhập đã bị đóng. Vui lòng thử lại.";
      } else if (error.code === 'auth/popup-blocked') {
        message = "Trình duyệt đã chặn cửa sổ Popup. Vui lòng cho phép hiện Popup để đăng nhập.";
      }
      alert(message);
    }
  };

  const logout = () => signOut(auth);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white font-light tracking-[0.3em]">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-white rounded-full animate-spin mb-4" />
        <span>INITIALIZING...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-sm bg-zinc-900 border border-white/5 p-12 rounded-3xl shadow-2xl text-center space-y-10">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-brand-red/20 mb-6">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-[0.2em] uppercase">Private Access</h1>
            <p className="text-zinc-500 font-light text-xs tracking-wide">Vui lòng đăng nhập để quản lý nội dung website.</p>
          </div>

          <button 
            onClick={login}
            className="w-full flex items-center justify-center space-x-4 bg-white text-black py-4 px-8 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-brand-red hover:text-white transition-all duration-300 shadow-xl"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập với Google</span>
          </button>

          <footer className="pt-8 border-t border-white/5 space-y-4">
            <div className="text-[9px] text-zinc-600 uppercase tracking-widest text-left">
              <p className="mb-2">Firebase Project ID:</p>
              <code className="text-zinc-400 block bg-zinc-800/50 py-2 px-3 rounded mb-4 selection:bg-brand-red selection:text-white">tangiahuyweb</code>
              
              <p className="mb-2">Action Required:</p>
              <div className="bg-brand-red/10 border border-brand-red/20 p-3 rounded-lg text-[10px] text-zinc-300 normal-case leading-relaxed">
                Hãy copy tên miền <span className="font-bold text-white underline selection:bg-brand-red selection:text-white">{typeof window !== 'undefined' ? window.location.hostname : '...'}</span> và thêm vào 
                <a 
                  href="https://console.firebase.google.com/project/tangiahuyweb/authentication/settings" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mx-1 text-brand-red hover:underline font-bold"
                >
                  Authorized Domains
                </a> 
                trong Firebase Console.
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 flex items-center space-x-2">
          <Settings className="w-6 h-6" />
          <span>Admin</span>
        </h1>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: 'hero', label: 'Hero (Video/Slides)', icon: Layout },
            { id: 'collections', label: 'Collections', icon: ImageIcon },
            { id: 'projects', label: 'Projects', icon: Layout },
            { id: 'news', label: 'News Items', icon: ImageIcon },
            { id: 'contact', label: 'Contact Info', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                activeTab === tab.id ? "bg-white text-black font-bold" : "hover:bg-zinc-900 text-zinc-400"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-zinc-800 pt-6">
          {user ? (
            <>
              <div className="flex items-center space-x-3 mb-4">
                <img src={user.photoURL || ''} className="w-8 h-8 rounded-full" alt="" />
                <div className="text-xs truncate max-w-[120px]">
                  <p className="font-bold">{user.displayName}</p>
                  <p className="opacity-50">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button 
              onClick={login}
              className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Login for full access</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        {activeTab === 'hero' && (
          <div className="space-y-12">
            <HeroSettingsManager data={heroSettings} />
            <SlideManager type="hero" items={heroSlides} collectionName="hero_slides" />
          </div>
        )}
        {activeTab === 'collections' && <SlideManager type="collection" items={collectionSlides} collectionName="collection_slides" />}
        {activeTab === 'projects' && <SlideManager type="project" items={projectSlides} collectionName="project_slides" description />}
        {activeTab === 'news' && <NewsManager items={newsItems} />}
        {activeTab === 'contact' && <ContactManager data={contactInfo} />}
      </main>
    </div>
  );
};

// --- Sub-components ---

const HeroSettingsManager = ({ data }: any) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateSettings = async (field: string, value: string) => {
    try { await setDoc(doc(db, 'settings', 'hero'), { [field]: value }, { merge: true }); }
    catch (e) { handleFirestoreError(e, OperationType.WRITE, 'settings/hero'); }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
      alert("Video quá lớn. Vui lòng chọn file dưới 200MB.");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const storageRef = ref(storage, `hero-videos/video-${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        }, 
        (error) => {
          console.error("Upload failed details:", error);
          let customMsg = error.message;
          if (error.code === 'storage/unauthorized') {
            customMsg = "Lỗi phân quyền! Hãy đảm bảo bạn đã: \n1. Nhấn nút 'Publish' trong Storage Rules.\n2. Thêm tên miền " + window.location.hostname + " vào 'Authorized Domains' trong Firebase Auth.";
          }
          alert("Tải lên thất bại: \n" + customMsg);
          setUploading(false);
        }, 
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await updateSettings('videoUrl', url);
          alert("Tải lên video thành công!");
          setUploading(false);
        }
      );
    } catch (error: any) {
      console.error("Upload start failed:", error);
      alert("Khởi tạo tải lên thất bại: " + error.message);
      setUploading(false);
    }
  };

  if (!data) return <button onClick={() => updateSettings('videoUrl', '/videos/hero-video.mp4')} className="bg-white/10 px-4 py-2 rounded">Initialize Hero Settings</button>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold uppercase tracking-widest">Hero Video Settings</h2>
        {uploading && (
          <div className="flex flex-col items-end space-y-1">
            <div className="text-[10px] text-white/60 uppercase tracking-widest">Đang tải: {Math.round(progress)}%</div>
            <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-red transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-zinc-500">Video Source URL (.mp4)</label>
          <input 
            defaultValue={data.videoUrl} 
            onBlur={(e) => updateSettings('videoUrl', e.target.value)}
            placeholder="e.g. /videos/hero-video.mp4 or external URL"
            className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-zinc-500">Hoặc Tải Lên Video Mới</label>
          <input 
            type="file" 
            accept="video/mp4" 
            onChange={handleVideoUpload}
            disabled={uploading}
            className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-200 cursor-pointer disabled:opacity-50"
          />
          <p className="text-[10px] text-zinc-500 mt-1">Hỗ trợ file .mp4. Sau khi tải lên, video sẽ tự động cập nhật ngoài trang chủ.</p>
        </div>
      </div>
    </div>
  );
};

const SlideManager = ({ items, collectionName, description = false }: any) => {
  const addSlide = async () => {
    const id = Date.now().toString();
    try {
      await setDoc(doc(db, collectionName, id), {
        image: 'https://picsum.photos/1920/1080',
        title: 'New Slide',
        description: description ? 'New description' : '',
        order: items.length
      });
    } catch (e) { handleFirestoreError(e, OperationType.WRITE, collectionName); }
  };

  const removeSlide = async (id: string) => {
    try { await deleteDoc(doc(db, collectionName, id)); }
    catch (e) { handleFirestoreError(e, OperationType.DELETE, `${collectionName}/${id}`); }
  };

  const updateSlide = async (id: string, data: any) => {
    try { await setDoc(doc(db, collectionName, id), data, { merge: true }); }
    catch (e) { handleFirestoreError(e, OperationType.WRITE, `${collectionName}/${id}`); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest">{collectionName.replace('_', ' ')}</h2>
        <button onClick={addSlide} className="bg-white text-black px-4 py-2 rounded-lg flex items-center space-x-2 font-bold hover:scale-105 transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Slide</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item: any) => (
          <div key={item.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex gap-6">
            <div className="w-48 h-32 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  defaultValue={item.title} 
                  onBlur={(e) => updateSlide(item.id, { title: e.target.value })}
                  placeholder="Title"
                  className="bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
                />
                <input 
                  defaultValue={item.image} 
                  onBlur={(e) => updateSlide(item.id, { image: e.target.value })}
                  placeholder="Image URL"
                  className="bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
                />
              </div>
              {description && (
                <textarea 
                  defaultValue={item.description} 
                  onBlur={(e) => updateSlide(item.id, { description: e.target.value })}
                  placeholder="Description"
                  rows={2}
                  className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
                />
              )}
            </div>
            <button onClick={() => removeSlide(item.id)} className="text-zinc-600 hover:text-red-500 self-start p-2 hover:bg-red-500/10 rounded-lg transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsManager = ({ items }: any) => {
  const positions = ['left', 'top-right', 'bottom-right'];
  
  const updateItem = async (id: string, data: any) => {
    try { await setDoc(doc(db, 'news_items', id), data, { merge: true }); }
    catch (e) { handleFirestoreError(e, OperationType.WRITE, `news_items/${id}`); }
  };

  // Ensure 3 spots exist
  useEffect(() => {
    positions.forEach(pos => {
      if (!items.find((i: any) => i.position === pos)) {
        const id = `news-${pos}`;
        setDoc(doc(db, 'news_items', id), {
          position: pos,
          image: 'https://picsum.photos/800/600',
          title: 'News Title',
          description: 'Summary text...',
          category: pos === 'left' ? 'TIN DỰ ÁN' : ''
        });
      }
    });
  }, [items]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold uppercase tracking-widest">News Manager</h2>
      <div className="grid grid-cols-1 gap-8">
        {positions.map(pos => {
          const item = items.find((i: any) => i.position === pos) || {};
          return (
            <div key={pos} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">Position: {pos}</span>
              </div>
              <div className="flex gap-6">
                <div className="w-48 h-32 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                   <div className="space-y-4">
                     <input 
                        defaultValue={item.title} 
                        onBlur={(e) => updateItem(item.id, { title: e.target.value })}
                        placeholder="Title"
                        className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
                      />
                      <input 
                        defaultValue={item.image} 
                        onBlur={(e) => updateItem(item.id, { image: e.target.value })}
                        placeholder="Image URL"
                        className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
                      />
                   </div>
                   <div className="space-y-4">
                      <input 
                        defaultValue={item.category} 
                        onBlur={(e) => updateItem(item.id, { category: e.target.value })}
                        placeholder="Category (e.g. TIN DỰ ÁN)"
                        className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
                      />
                      <textarea 
                        defaultValue={item.description} 
                        onBlur={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="Description"
                        rows={2}
                        className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
                      />
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ContactManager = ({ data }: any) => {
  const updateInfo = async (field: string, value: string) => {
    try { await setDoc(doc(db, 'contact', 'info'), { [field]: value }, { merge: true }); }
    catch (e) { handleFirestoreError(e, OperationType.WRITE, 'contact/info'); }
  };

  if (!data) return <button onClick={() => updateInfo('address', '...')}>Initialize Contact Info</button>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold uppercase tracking-widest">Contact Manager</h2>
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-zinc-500">Address</label>
          <input 
            defaultValue={data.address} 
            onBlur={(e) => updateInfo('address', e.target.value)}
            className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-zinc-500">Phone</label>
          <input 
            defaultValue={data.phone} 
            onBlur={(e) => updateInfo('phone', e.target.value)}
            className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-zinc-500">Email</label>
          <input 
            defaultValue={data.email} 
            onBlur={(e) => updateInfo('email', e.target.value)}
            className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-zinc-500">Contact Background Image</label>
          <input 
            defaultValue={data.background} 
            onBlur={(e) => updateInfo('background', e.target.value)}
            className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all"
          />
          <div className="mt-2 w-full h-32 rounded-lg overflow-hidden">
            <img src={data.background} className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
