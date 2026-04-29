'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
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
import { LogIn, LogOut, Plus, Trash2, Save, Image as ImageIcon, Layout, Settings } from 'lucide-react';
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
  const [collectionSlides, setCollectionSlides] = useState<any[]>([]);
  const [projectSlides, setProjectSlides] = useState<any[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    // Auto-login or just stay as is. User wants "vào luôn"
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // We allow reading even if !user because rules allow read: if true
    
    // Real-time listeners
    const unsubHero = onSnapshot(query(collection(db, 'hero_slides'), orderBy('order')), 
      (snap) => setHeroSlides(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'hero_slides')
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
      unsubCollections();
      unsubProjects();
      unsubNews();
      unsubContact();
    };
  }, [user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => signOut(auth);

  if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-950 text-white">Loading...</div>;

  // Removed the !user blocking check per user request "vào luôn admin"

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
            { id: 'hero', label: 'Hero Slides', icon: Layout },
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
        {activeTab === 'hero' && <SlideManager type="hero" items={heroSlides} collectionName="hero_slides" />}
        {activeTab === 'collections' && <SlideManager type="collection" items={collectionSlides} collectionName="collection_slides" />}
        {activeTab === 'projects' && <SlideManager type="project" items={projectSlides} collectionName="project_slides" description />}
        {activeTab === 'news' && <NewsManager items={newsItems} />}
        {activeTab === 'contact' && <ContactManager data={contactInfo} />}
      </main>
    </div>
  );
};

// --- Sub-components ---

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
