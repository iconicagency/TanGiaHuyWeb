"use client";

import React, { useState, useEffect } from "react";
import { auth, db, storage } from "@/lib/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  LogIn,
  LogOut,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  Layout,
  Settings,
  ExternalLink,
  ChevronDown,
  Grid as GridIcon,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper for handleFirestoreError is required by instructions
enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  const jsonErr = JSON.stringify(errInfo);
  console.error("Firestore Error: ", jsonErr);
  // Instructions say MUST throw with specific JSON
  throw new Error(jsonErr);
}

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userAdmin, setUserAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "general" | "hero" | "collections" | "projects" | "news" | "contact" | "company" | "menu" | "products" | "about_home" | "collections_page" | "products_page"
  >("general");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Data states
  const [generalSettings, setGeneralSettings] = useState<any>(undefined); // undefined = loading, null = not exists
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<any>(null);
  const [collectionSlides, setCollectionSlides] = useState<any[]>([]);
  const [projectSlides, setProjectSlides] = useState<any[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [companyContent, setCompanyContent] = useState<any>(null);
  const [navLinks, setNavLinks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [aboutHome, setAboutHome] = useState<any>(null);
  const [collectionsPageContent, setCollectionsPageContent] = useState<any>(null);
  const [productsPageContent, setProductsPageContent] = useState<any>(null);

  useEffect(() => {
    console.log("Admin: Auth checking...");
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setUserAdmin(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Check if user is admin via firestore
    const unsubAdmin = onSnapshot(
      doc(db, "admins", user.uid),
      (snap) => {
        console.log("Admin: Permissions loaded", snap.exists());
        setUserAdmin(snap.exists() ? snap.data() : null);
        setLoading(false);
      },
      (err) => {
        console.error("Admin check failed:", err);
        setUserAdmin(null);
        setLoading(false);
      },
    );

    return () => unsubAdmin();
  }, [user]);

  const isAdmin =
    userAdmin?.authorized || 
    user?.email === "thanhnt.ads@gmail.com" || 
    user?.email === "hyperlinkec@gmail.com";

  useEffect(() => {
    if (!isAdmin) return;

    console.log("Admin: Initializing listeners...");

    // Real-time listeners
    const unsubGeneral = onSnapshot(
      doc(db, "settings", "general"),
      (snap) => {
        console.log("Admin: General settings updated");
        setGeneralSettings(snap.exists() ? snap.data() : null);
      },
      (err) => {
        console.error("Admin: General settings listener error", err);
        setErrorStatus("Cannot load settings: " + err.message);
      },
    );

    const unsubHero = onSnapshot(
      query(collection(db, "hero_slides"), orderBy("order")),
      (snap) =>
        setHeroSlides(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, "hero_slides"),
    );

    const unsubHeroSettings = onSnapshot(
      doc(db, "settings", "hero"),
      (snap) => setHeroSettings(snap.exists() ? snap.data() : null),
      (err) => handleFirestoreError(err, OperationType.GET, "settings/hero"),
    );

    const unsubCollections = onSnapshot(
      query(collection(db, "collection_slides"), orderBy("order")),
      (snap) =>
        setCollectionSlides(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) =>
        handleFirestoreError(err, OperationType.LIST, "collection_slides"),
    );

    const unsubProjects = onSnapshot(
      query(collection(db, "project_slides"), orderBy("order")),
      (snap) =>
        setProjectSlides(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, "project_slides"),
    );

    const unsubNews = onSnapshot(
      collection(db, "news_items"),
      (snap) => setNewsItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, "news_items"),
    );

    const unsubContact = onSnapshot(
      doc(db, "contact", "info"),
      (snap) => setContactInfo(snap.exists() ? snap.data() : null),
      (err) => handleFirestoreError(err, OperationType.GET, "contact/info"),
    );

    const unsubCompany = onSnapshot(
      doc(db, "cms", "company_page"),
      (snap) => setCompanyContent(snap.exists() ? snap.data() : null),
      (err) => handleFirestoreError(err, OperationType.GET, "cms/company_page"),
    );

    const unsubNavigation = onSnapshot(
      doc(db, "settings", "navigation"),
      (snap) => {
        if (snap.exists() && snap.data().links) {
          setNavLinks(snap.data().links);
        } else {
          setNavLinks([]);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, "settings/navigation"),
    );

    const unsubProducts = onSnapshot(
      query(collection(db, "products"), orderBy("order")),
      (snap) => setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => handleFirestoreError(err, OperationType.LIST, "products"),
    );

    const unsubAboutHome = onSnapshot(
      doc(db, "cms", "about_home"),
      (snap) => setAboutHome(snap.exists() ? snap.data() : null),
      (err) => handleFirestoreError(err, OperationType.GET, "cms/about_home"),
    );

    const unsubCollectionsPage = onSnapshot(
      doc(db, "cms", "collections_page"),
      (snap) => setCollectionsPageContent(snap.exists() ? snap.data() : null),
      (err) => handleFirestoreError(err, OperationType.GET, "cms/collections_page"),
    );

    const unsubProductsPage = onSnapshot(
      doc(db, "cms", "products_page"),
      (snap) => setProductsPageContent(snap.exists() ? snap.data() : null),
      (err) => handleFirestoreError(err, OperationType.GET, "cms/products_page"),
    );

    return () => {
      unsubGeneral();
      unsubHero();
      unsubHeroSettings();
      unsubCollections();
      unsubProjects();
      unsubNews();
      unsubContact();
      unsubCompany();
      unsubNavigation();
      unsubProducts();
      unsubAboutHome();
      unsubCollectionsPage();
      unsubProductsPage();
    };
  }, [isAdmin]);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to avoid auto-login with wrong account
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login error:", error);
      let message = "Đã có lỗi xảy ra khi đăng nhập.";
      if (error.code === "auth/unauthorized-domain") {
        message =
          "Tên miền hiện tại (" +
          window.location.hostname +
          ") chưa được ủy quyền trong Firebase Auth Console. Hãy thêm nó vào phần 'Authorized Domains'.";
      } else if (error.code === "auth/popup-closed-by-user") {
        message = "Cửa sổ đăng nhập đã bị đóng. Vui lòng thử lại.";
      } else if (error.code === "auth/popup-blocked") {
        message =
          "Trình duyệt đã chặn cửa sổ Popup. Vui lòng cho phép hiện Popup để đăng nhập.";
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
            <h1 className="text-2xl font-bold tracking-[0.2em] uppercase">
              Private Access
            </h1>
            <p className="text-zinc-500 font-light text-xs tracking-wide">
              Vui lòng đăng nhập để quản lý nội dung website.
            </p>
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
              <code className="text-zinc-400 block bg-zinc-800/50 py-2 px-3 rounded mb-4 selection:bg-brand-red selection:text-white">
                tangiahuyweb
              </code>

              <p className="mb-2">Action Required:</p>
              <div className="bg-brand-red/10 border border-brand-red/20 p-3 rounded-lg text-[10px] text-zinc-300 normal-case leading-relaxed">
                Hãy copy tên miền{" "}
                <span className="font-bold text-white underline selection:bg-brand-red selection:text-white">
                  {typeof window !== "undefined"
                    ? window.location.hostname
                    : "..."}
                </span>{" "}
                và thêm vào
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

  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/5 p-12 rounded-3xl shadow-2xl text-center space-y-10">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-10 h-10 text-zinc-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-[0.2em] uppercase">
              Access Denied
            </h1>
            <p className="text-zinc-500 font-light text-xs tracking-wide">
              Tài khoản{" "}
              <span className="text-white font-medium">{user.email}</span> chưa
              được cấp quyền quản trị.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={async () => {
                if (!user) return;
                try {
                  await setDoc(doc(db, "admins", user.uid), {
                    email: user.email,
                    authorized: true,
                    createdAt: serverTimestamp(),
                  });
                  alert("Đã cấp quyền Admin! Hãy tải lại trang.");
                  window.location.reload();
                } catch (e: any) {
                  alert("Lỗi cấp quyền: " + e.message);
                }
              }}
              className="w-full py-4 bg-brand-red text-white rounded-full font-bold uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl shadow-brand-red/20"
            >
              Kích hoạt quyền Admin cho tài khoản này
            </button>

            <button
              onClick={logout}
              className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-zinc-700 hover:text-white transition-all"
            >
              Đăng xuất
            </button>
          </div>
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
            { id: "general", label: "Global (Logo/BG)", icon: ExternalLink },
            { id: "menu", label: "Thanh Menu (Header)", icon: Layout },
            { id: "hero", label: "Trang chủ (Video)", icon: Layout },
            { id: "about_home", label: "Trang chủ (Về TGH)", icon: Layout },
            { id: "projects", label: "Sản phẩm mới", icon: Layout },
            { id: "collections", label: "Bộ sưu tập", icon: ImageIcon },
            { id: "news", label: "Tin tức", icon: ImageIcon },
            { id: "collections_page", label: "Trang Bộ sưu tập", icon: Layout },
            { id: "products_page", label: "Banner Sản phẩm", icon: Layout },
            { id: "contact", label: "Thông tin liên hệ", icon: Settings },
            { id: "company", label: "Về Tân Gia Huy", icon: Layout },
            { id: "products", label: "Danh sách sản phẩm", icon: GridIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                console.log("Switching to tab:", tab.id);
                setActiveTab(tab.id as any);
              }}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                activeTab === tab.id
                  ? "bg-white text-black font-bold"
                  : "hover:bg-zinc-900 text-zinc-400",
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-zinc-800 pt-6">
          {errorStatus && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 lowercase">
              {errorStatus}
            </div>
          )}
          {user ? (
            <>
              <div className="flex items-center space-x-3 mb-4">
                {user.photoURL && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
              <span>Login</span>
            </button>
          )}
          <div className="mt-8 p-4 bg-zinc-900 rounded-xl border border-white/5 space-y-4">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
              Trợ giúp Video & Hosting
            </h4>

            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">
                  💡 NÊN DÙNG:
                </p>
                <div className="space-y-3 text-[11px] text-zinc-400 font-light leading-relaxed">
                  <p>
                    <strong className="text-white">
                      1. Pexels (Khuyên dùng):
                    </strong>{" "}
                    Ổn định nhất. Chuột phải vào video {">"} &quot;Sao chép địa chỉ
                    video&quot;.
                  </p>
                  <p>
                    <strong className="text-white">2. Dropbox:</strong> Rất tốt.
                    Lấy link share, hệ thống sẽ tự chuyển thành link trực tiếp.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-2">
                  ⚠️ LƯU Ý GOOGLE DRIVE:
                </p>
                <div className="space-y-2 text-[11px] text-zinc-400 font-light leading-relaxed">
                  <p>
                    Google Drive{" "}
                    <strong className="text-white">
                      chặn các video dung lượng lớn
                    </strong>{" "}
                    (thường {">"}50MB) để quét virus. Khi đó video sẽ bị lỗi
                    không chạy được.
                  </p>
                  <p className="italic text-zinc-500">
                    Giải pháp: Nén dung lượng video xuống dưới 20MB hoặc dùng
                    Pexels/Dropbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
          �
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        {activeTab === "general" && (
          <GeneralSettingsManager data={generalSettings} />
        )}
        {activeTab === "hero" && (
          <div className="space-y-12">
            <HeroSettingsManager data={heroSettings} />
            <SlideManager
              type="hero"
              items={heroSlides}
              collectionName="hero_slides"
            />
          </div>
        )}
        {activeTab === "collections" && (
          <SlideManager
            type="collection"
            items={collectionSlides}
            collectionName="collection_slides"
          />
        )}
        {activeTab === "projects" && (
          <SlideManager
            type="project"
            items={projectSlides}
            collectionName="project_slides"
            description
          />
        )}
        {activeTab === "news" && <NewsManager items={newsItems} />}
        {activeTab === "contact" && <ContactManager data={contactInfo} />}
        {activeTab === "company" && <CompanyContentManager data={companyContent} />}
        {activeTab === "menu" && <MenuManager items={navLinks} />}
        {activeTab === "products" && <ProductManager items={products} />}
        {activeTab === "about_home" && <AboutHomeManager data={aboutHome} />}
        {activeTab === "collections_page" && <CollectionsPageManager data={collectionsPageContent} />}
        {activeTab === "products_page" && <ProductsPageManager data={productsPageContent} />}
      </main>
    </div>
  );
};

// --- Sub-components ---

const GeneralSettingsManager = ({ data }: any) => {
  const updateSettings = async (field: string, value: string) => {
    try {
      console.log(`Updating general setting: ${field} = ${value}`);
      await setDoc(
        doc(db, "settings", "general"),
        { [field]: value },
        { merge: true },
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "settings/general");
    }
  };

  const sections = [
    { id: "logoUrl", label: "Logo Image" },
    { id: "section2Bg", label: "Section 2 (About) Background" },
    { id: "section3Bg", label: "Section 3 (Projects) Background" },
    { id: "section4Bg", label: "Section 4 (Collections) Background" },
    { id: "section5Bg", label: "Section 5 (News) Background" },
    { id: "section6Bg", label: "Section 6 (Contact) Background" },
  ];

  if (data === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-zinc-500">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin mb-4" />
        <span className="text-[10px] uppercase tracking-widest font-bold">
          Loading Global Settings...
        </span>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="bg-zinc-900/50 p-12 rounded-3xl border border-white/5 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-xl font-bold mb-2 uppercase tracking-widest text-white">
          Chưa có dữ liệu
        </h3>
        <p className="mb-8 text-zinc-500 text-xs leading-relaxed">
          Hệ thống chưa tìm thấy cấu hình Global Settings. Vui lòng khởi tạo
          ngay để bắt đầu thiết lập Logo và Hình nền.
        </p>
        <button
          onClick={() => updateSettings("logoUrl", "")}
          className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
        >
          Khởi tạo ngay
        </button>
      </div>
    );
  }

  const safeData = data || {};

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">
          Global Settings
        </h2>
        <p className="text-zinc-500 text-xs font-light tracking-wide">
          Quản lý logo thương hiệu và hình nền chính cho các phân đoạn website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((s) => (
          <div
            key={s.id}
            className="group bg-zinc-900 p-8 rounded-2xl border border-white/5 space-y-6 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                {s.label}
              </label>
            </div>

            <ImageUploader
              value={safeData[s.id]}
              onUpload={(url) => updateSettings(s.id, url)}
              folder="general"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageUploader = ({
  value,
  onUpload,
  folder = "uploads",
}: {
  value: string;
  onUpload: (url: string) => void;
  folder?: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ảnh quá lớn. Vui lòng chọn file dưới 10MB.");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (error) => {
          console.error("Upload failed:", error);
          alert("Tải lên thất bại: " + error.message);
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          onUpload(url);
          setUploading(false);
        },
      );
    } catch (error: any) {
      alert("Lỗi: " + error.message);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative group/uploader">
        {value ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-zinc-800 shadow-2xl">
            <img
              src={value}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/uploader:scale-105"
              alt="Preview"
              onError={(e) => {
                (e.target as any).src =
                  "https://placehold.co/600x400/27272a/white?text=Invalid+Image";
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/uploader:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-110 transition-transform">
                Thay đổi ảnh
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900 transition-colors cursor-pointer group/label">
            <ImageIcon className="w-10 h-10 text-zinc-600 mb-3 group-hover/label:text-zinc-400 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover/label:text-zinc-300 transition-colors">
              Tải ảnh lên
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
            <div className="w-12 h-12 border-2 border-zinc-800 border-t-white rounded-full animate-spin mb-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              Đang tải: {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
          Hoặc dán URL ảnh
        </label>
        <input
          value={value || ""}
          onChange={(e) => onUpload(e.target.value)}
          placeholder="https://..."
          className="w-full bg-zinc-800/50 px-4 py-2 rounded-lg border border-white/5 outline-none focus:border-white/20 transition-all text-[11px] font-light"
        />
      </div>
    </div>
  );
};

const HeroSettingsManager = ({ data }: any) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const formatVideoUrl = (url: string) => {
    if (!url) return "";

    // Warn if it looks like a Pexels page/download link instead of a direct file link
    if (
      url.includes("pexels.com") &&
      (url.includes("/video/") || url.includes("/download/video/")) &&
      !url.includes(".mp4")
    ) {
      alert(
        "CẢNH BÁO: Link Pexels bạn vừa nhập có vẻ là link TRANG WEB hoặc TRANG DOWNLOAD, không phải link VIDEO trực tiếp (.mp4).\n\nHãy chuột phải vào video trên trang Pexels đó và chọn 'Sao chép địa chỉ video' (Copy video address) để lấy link đúng.",
      );
    }

    // Warn if it looks like a Vimeo page link
    if (
      url.includes("vimeo.com") &&
      !url.includes("player.vimeo.com/external") &&
      !url.includes(".mp4")
    ) {
      alert(
        "CẢNH BÁO: Link Vimeo này có vẻ là link TRANG WEB, không phải link trực tiếp. Video sẽ không chạy được.\n\nLưu ý: Vimeo chỉ hỗ trợ link trực tiếp (.mp4) cho các tài khoản trả phí cao (Pro/Business). Nếu bạn không có tài khoản trả phí, hãy cân nhắc dùng Pexels hoặc Google Drive.",
      );
    }

    // Fix Google Drive links automatically
    if (url.includes("drive.google.com")) {
      const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
      if (match && match[1]) {
        // Updated format that often works better for direct streaming
        return `https://drive.google.com/uc?id=${match[1]}&export=download`;
      }
    }

    // Fix Dropbox links automatically
    if (url.includes("dropbox.com")) {
      return url.replace("?dl=0", "?raw=1").replace("&dl=0", "&raw=1");
    }

    return url;
  };

  const updateSettings = async (field: string, value: string) => {
    const finalValue = field === "videoUrl" ? formatVideoUrl(value) : value;
    try {
      await setDoc(
        doc(db, "settings", "hero"),
        { [field]: finalValue },
        { merge: true },
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "settings/hero");
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert("Video quá lớn. Vui lòng chọn file dưới 100MB.");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const storageRef = ref(
        storage,
        `hero-videos/video-${Date.now()}-${file.name}`,
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (error) => {
          console.error("Upload failed details:", error);
          alert("Tải lên thất bại: " + error.message);
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await updateSettings("videoUrl", url);
          setUploading(false);
        },
      );
    } catch (error: any) {
      alert("Lỗi: " + error.message);
      setUploading(false);
    }
  };

  const resetToDefault = async () => {
    if (confirm("Đặt lại video về mặc định?")) {
      await updateSettings("videoUrl", "/videos/hero-video.mp4");
    }
  };

  if (!data)
    return (
      <div className="bg-zinc-900/50 p-12 rounded-3xl border border-white/5 text-center max-w-lg mx-auto">
        <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-white">
          Chưa có cấu hình Hero
        </h3>
        <button
          onClick={() => updateSettings("videoUrl", "/videos/hero-video.mp4")}
          className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
        >
          Khởi tạo ngay
        </button>
      </div>
    );

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">
            Trang chủ (Video)
          </h2>
          <p className="text-zinc-500 text-xs font-light tracking-wide">
            Quản lý video nền cho trang chủ. Link chuẩn phải là link trực tiếp
            (.mp4).
          </p>
        </div>
        <button
          onClick={resetToDefault}
          className="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors mb-2"
        >
          Reset về mặc định
        </button>
      </div>

      <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold ml-1">
              Video URL (Direct link .mp4)
            </label>
            <label className="cursor-pointer bg-white text-black px-4 py-1.5 rounded-full font-bold text-[9px] uppercase tracking-widest hover:scale-105 transition-all">
              {uploading
                ? `Đang tải ${Math.round(progress)}%`
                : "Tải video từ máy"}
              <input
                type="file"
                className="hidden"
                accept="video/mp4"
                onChange={handleVideoUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex gap-4">
            <input
              defaultValue={data.videoUrl}
              onBlur={(e) => updateSettings("videoUrl", e.target.value)}
              placeholder="https://...video.mp4"
              className="flex-1 bg-zinc-800/50 px-6 py-4 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light tracking-wide"
            />
            <a
              href={data.videoUrl}
              target="_blank"
              className="p-4 bg-zinc-800 rounded-xl border border-white/5 hover:bg-zinc-700 transition-colors flex items-center justify-center"
            >
              <ExternalLink className="w-5 h-5 text-zinc-400" />
            </a>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 text-blue-400">
              <ExternalLink className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Hướng dẫn lấy link từ Pexels:
              </span>
            </div>
            <div className="text-zinc-400 text-[11px] space-y-2 font-light leading-relaxed">
              <p>
                1. Tại Pexels, nhấn vào nút{" "}
                <b className="text-white">&quot;Tải xuống miễn phí&quot;</b>.
              </p>
              <p>
                2. Khi video hiện ra ở tab mới,{" "}
                <b className="text-white">nhấn chuột phải</b> vào video.
              </p>
              <p>
                3. Chọn{" "}
                <b className="text-white">&quot;Sao chép địa chỉ video&quot;</b>{" "}
                (Copy video address).
              </p>
              <p className="text-red-400/80 italic mt-2">
                Lưu ý: Link đúng thường bắt đầu bằng{" "}
                <code className="bg-black/40 px-1 py-0.5 rounded text-white">
                  videos.pexels.com/...
                </code>
              </p>
            </div>
          </div>
        </div>

        {data.videoUrl && (
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">
              Bản xem trước
            </label>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-zinc-800 shadow-2xl">
              <video
                key={data.videoUrl}
                src={data.videoUrl}
                className="w-full h-full object-cover"
                controls
                muted
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SlideManager = ({ items, collectionName, description = false }: any) => {
  const addSlide = async () => {
    const id = Date.now().toString();
    try {
      await setDoc(doc(db, collectionName, id), {
        image: "https://picsum.photos/1920/1080",
        title: "New Slide",
        description: description ? "New description" : "",
        order: items.length,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, collectionName);
    }
  };

  const removeSlide = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  const updateSlide = async (id: string, data: any) => {
    try {
      await setDoc(doc(db, collectionName, id), data, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${collectionName}/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest">
          {collectionName === "project_slides"
            ? "Quản lý Sản phẩm mới"
            : collectionName === "collection_slides"
              ? "Quản lý Bộ sưu tập"
              : collectionName.replace("_", " ")}
        </h2>
        <button
          onClick={addSlide}
          className="bg-white text-black px-4 py-2 rounded-lg flex items-center space-x-2 font-bold hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm slide mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex gap-6"
          >
            <div className="w-64 flex-shrink-0">
              <ImageUploader
                value={item.image}
                onUpload={(url) => updateSlide(item.id, { image: url })}
                folder={collectionName}
              />
            </div>
            <div className="flex-1 space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    Tiêu đề slide
                  </label>
                  <input
                    defaultValue={item.title}
                    onBlur={(e) =>
                      updateSlide(item.id, { title: e.target.value })
                    }
                    placeholder="Title"
                    className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all text-sm"
                  />
                </div>
              </div>
              {description && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    defaultValue={item.description}
                    onBlur={(e) =>
                      updateSlide(item.id, { description: e.target.value })
                    }
                    placeholder="Description"
                    rows={3}
                    className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all text-sm"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => removeSlide(item.id)}
              className="text-zinc-600 hover:text-red-500 self-start p-2 hover:bg-red-500/10 rounded-lg transition-all pt-6"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsManager = ({ items }: any) => {
  const positions = ["left", "top-right", "bottom-right"];

  const updateItem = async (id: string, data: any) => {
    try {
      await setDoc(doc(db, "news_items", id), data, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `news_items/${id}`);
    }
  };

  // Ensure 3 spots exist
  useEffect(() => {
    const fixedPositions = ["left", "top-right", "bottom-right"];
    fixedPositions.forEach((pos) => {
      if (!items.find((i: any) => i.position === pos)) {
        const id = `news-${pos}`;
        setDoc(doc(db, "news_items", id), {
          position: pos,
          image: "https://picsum.photos/800/600",
          title: "News Title",
          description: "Summary text...",
          category: pos === "left" ? "TIN DỰ ÁN" : "",
        });
      }
    });
  }, [items]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold uppercase tracking-widest">
        News Manager
      </h2>
      <div className="grid grid-cols-1 gap-8">
        {positions.map((pos) => {
          const item = items.find((i: any) => i.position === pos) || {};
          return (
            <div
              key={pos}
              className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
            >
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                  Vị trí hiển thị: {pos}
                </span>
              </div>
              <div className="flex gap-8">
                <div className="w-64 flex-shrink-0">
                  <ImageUploader
                    value={item.image}
                    onUpload={(url) => updateItem(item.id, { image: url })}
                    folder="news"
                  />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                        Tiêu đề tin
                      </label>
                      <input
                        defaultValue={item.title}
                        onBlur={(e) =>
                          updateItem(item.id, { title: e.target.value })
                        }
                        placeholder="Title"
                        className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                        Chuyên mục
                      </label>
                      <input
                        defaultValue={item.category}
                        onBlur={(e) =>
                          updateItem(item.id, { category: e.target.value })
                        }
                        placeholder="Category (e.g. TIN DỰ ÁN)"
                        className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                        Tóm tắt nội dung
                      </label>
                      <textarea
                        defaultValue={item.description}
                        onBlur={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                        placeholder="Description"
                        rows={4}
                        className="w-full bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-white transition-all text-sm"
                      />
                    </div>
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
    try {
      await setDoc(
        doc(db, "contact", "info"),
        { [field]: value },
        { merge: true },
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "contact/info");
    }
  };

  if (!data)
    return (
      <div className="bg-zinc-900/50 p-12 rounded-3xl border border-white/5 text-center max-w-lg mx-auto">
        <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-white">
          Chưa có thông tin liên hệ
        </h3>
        <button
          onClick={() => updateInfo("address", "...")}
          className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
        >
          Khởi tạo ngay
        </button>
      </div>
    );

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">
          Contact Info
        </h2>
        <p className="text-zinc-500 text-xs font-light tracking-wide">
          Cập nhật thông tin địa chỉ, số điện thoại và email hiển thị ở chân
          trang web.
        </p>
      </div>

      <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5 space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold ml-1">
            Địa chỉ văn phòng
          </label>
          <input
            defaultValue={data.address}
            onBlur={(e) => updateInfo("address", e.target.value)}
            placeholder="Số... Đường... Phường... Quận..."
            className="w-full bg-zinc-800/50 px-6 py-4 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm tracking-wide"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold ml-1">
              Số điện thoại
            </label>
            <input
              defaultValue={data.phone}
              onBlur={(e) => updateInfo("phone", e.target.value)}
              placeholder="09xx xxx xxx"
              className="w-full bg-zinc-800/50 px-6 py-4 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm tracking-wide"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold ml-1">
              Địa chỉ Email
            </label>
            <input
              defaultValue={data.email}
              onBlur={(e) => updateInfo("email", e.target.value)}
              placeholder="example@gmail.com"
              className="w-full bg-zinc-800/50 px-6 py-4 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm tracking-wide"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuManager = ({ items }: { items: any[] }) => {
  const updateLinks = async (newLinks: any[]) => {
    try {
      await setDoc(doc(db, "settings", "navigation"), { links: newLinks }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "settings/navigation");
    }
  };

  const addItem = () => {
    const newItem = { name: "NEW ITEM", href: "/", desc: "New description" };
    updateLinks([...items, newItem]);
  };

  const removeItem = (idx: number) => {
    const newLinks = [...items];
    newLinks.splice(idx, 1);
    updateLinks(newLinks);
  };

  const updateItem = (idx: number, field: string, value: string) => {
    const newLinks = [...items];
    newLinks[idx] = { ...newLinks[idx], [field]: value };
    updateLinks(newLinks);
  };

  const moveItem = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === items.length - 1) return;
    
    const newLinks = [...items];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newLinks[idx], newLinks[targetIdx]] = [newLinks[targetIdx], newLinks[idx]];
    updateLinks(newLinks);
  };

  const initializeDefault = () => {
    const defaultLinks = [
      { name: 'TRANG CHỦ', href: '/', desc: 'Kiến tạo không gian sống' },
      { name: 'VỀ TÂN GIA HUY', href: '/ve-tan-gia-huy', desc: 'Hành trình và sứ mệnh' },
      { name: 'SẢN PHẨM', href: '/products', desc: 'Tinh hoa vật liệu cao cấp' },
      { name: 'BỘ SƯU TẬP', href: '/collections', desc: 'Đẳng cấp và khác biệt' },
      { name: 'TIN TỨC', href: '/', desc: 'Cập nhật xu hướng mới nhất' },
      { name: 'LIÊN HỆ', href: '/contact', desc: 'Kết nối cùng chúng tôi' },
    ];
    updateLinks(defaultLinks);
  };

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">Menu Navigation</h2>
          <p className="text-zinc-500 text-xs font-light tracking-wide">Quản lý các đề mục trên thanh điều hướng chính.</p>
        </div>
        <div className="space-x-4">
          <button onClick={initializeDefault} className="text-xs text-zinc-500 hover:text-white transition-colors">Reset về mặc định</button>
          <button onClick={addItem} className="bg-white text-black px-6 py-2 rounded-lg font-bold flex items-center space-x-2 text-sm hover:scale-105 transition-all">
            <Plus className="w-4 h-4" />
            <span>Thêm mục mới</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
        {items.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <p className="text-zinc-500 italic">Chưa có mục menu nào.</p>
            <button onClick={initializeDefault} className="bg-zinc-800 text-white px-6 py-2 rounded-lg text-sm">Khởi tạo nhanh</button>
          </div>
        )}
        <div className="divide-y divide-white/5">
          {items.map((item, idx) => (
            <div key={idx} className="p-6 flex items-start gap-6 hover:bg-white/5 transition-colors group">
              <div className="flex flex-col gap-2 pt-2">
                <button onClick={() => moveItem(idx, 'up')} className="p-1 hover:bg-zinc-800 rounded text-zinc-600 hover:text-white transition-colors">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-bottom-[6px] border-bottom-current rotate-180" />
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </button>
                <button onClick={() => moveItem(idx, 'down')} className="p-1 hover:bg-zinc-800 rounded text-zinc-600 hover:text-white transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Tên hiển thị</label>
                  <input 
                    value={item.name} 
                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    className="w-full bg-zinc-800 border border-white/5 px-4 py-2 rounded-lg text-sm text-white focus:border-brand-gold outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Đường dẫn (Link)</label>
                  <input 
                    value={item.href} 
                    onChange={(e) => updateItem(idx, 'href', e.target.value)}
                    className="w-full bg-zinc-800 border border-white/5 px-4 py-2 rounded-lg text-sm text-white focus:border-brand-gold outline-none transition-all"
                    placeholder="/abc hoặc https://..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Mô tả ngắn</label>
                  <input 
                    value={item.desc} 
                    onChange={(e) => updateItem(idx, 'desc', e.target.value)}
                    className="w-full bg-zinc-800 border border-white/5 px-4 py-2 rounded-lg text-sm text-white focus:border-brand-gold outline-none transition-all"
                    placeholder="Dòng chữ nhỏ dưới menu..."
                  />
                </div>
              </div>

              <button onClick={() => removeItem(idx)} className="mt-6 p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductManager = ({ items }: any) => {
  const addProduct = async () => {
    const id = Date.now().toString();
    try {
      await setDoc(doc(db, "products", id), {
        name: "Sản phẩm mới",
        specs: "40×80, 9mm, Matt, RT, R9 A",
        image: "https://picsum.photos/800/1200",
        category: "Gạch",
        brand: "Caesar",
        order: items.length,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "products");
    }
  };

  const removeProduct = async (id: string) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `products/${id}`);
    }
  };

  const updateProduct = async (id: string, data: any) => {
    try {
      await setDoc(doc(db, "products", id), data, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `products/${id}`);
    }
  };

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">
            Danh sách sản phẩm
          </h2>
          <p className="text-zinc-500 text-xs font-light tracking-wide">
            Quản lý tất cả sản phẩm hiển thị trên trang sản phẩm.
          </p>
        </div>
        <button
          onClick={addProduct}
          className="bg-white text-black px-6 py-3 rounded-full flex items-center space-x-2 font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="bg-zinc-900 p-8 rounded-3xl border border-white/5 flex gap-10 hover:border-white/10 transition-all"
          >
            <div className="w-56 flex-shrink-0">
              <ImageUploader
                value={item.image}
                onUpload={(url) => updateProduct(item.id, { image: url })}
                folder="products"
              />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                    Tên sản phẩm
                  </label>
                  <input
                    defaultValue={item.name}
                    onBlur={(e) =>
                      updateProduct(item.id, { name: e.target.value })
                    }
                    placeholder="Tên sản phẩm"
                    className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                    Thông số kỹ thuật
                  </label>
                  <input
                    defaultValue={item.specs}
                    onBlur={(e) =>
                      updateProduct(item.id, { specs: e.target.value })
                    }
                    placeholder="VD: 40×80, 9mm, Matt..."
                    className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                    Phân loại (Category)
                  </label>
                  <input
                    defaultValue={item.category}
                    onBlur={(e) =>
                      updateProduct(item.id, { category: e.target.value })
                    }
                    placeholder="Gạch, Ngói, Thiết bị..."
                    className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                    Thương hiệu
                  </label>
                  <input
                    defaultValue={item.brand}
                    onBlur={(e) =>
                      updateProduct(item.id, { brand: e.target.value })
                    }
                    placeholder="Caesar, Toto..."
                    className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between py-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                  Thứ tự
                </label>
                <input
                  type="number"
                  defaultValue={item.order}
                  onBlur={(e) =>
                    updateProduct(item.id, { order: parseInt(e.target.value) || 0 })
                  }
                  className="w-16 bg-zinc-800/50 px-3 py-2 rounded-lg border border-white/5 outline-none text-center text-sm"
                />
              </div>
              <button
                onClick={() => removeProduct(item.id)}
                className="text-zinc-600 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-dashed border-zinc-800">
            <Database className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Chưa có sản phẩm nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AboutHomeManager = ({ data }: any) => {
  const updateContent = async (field: string, value: string) => {
    try {
      await setDoc(doc(db, "cms", "about_home"), { [field]: value }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "cms/about_home");
    }
  };

  if (!data) {
    return (
      <div className="bg-zinc-900/50 p-12 rounded-3xl border border-white/5 text-center max-w-lg mx-auto">
        <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-white">Chưa có nội dung Về TGH Home</h3>
        <button
          onClick={() => updateContent("title", "VỀ TÂN GIA HUY")}
          className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
        >
          Khởi tạo ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">Trang chủ (Về TGH)</h2>
        <p className="text-zinc-500 text-xs font-light tracking-wide">Quản lý nội dung giới thiệu tại Section 2 trang chủ.</p>
      </div>

      <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Tiêu đề (Title)</label>
                <input
                  defaultValue={data.title}
                  onBlur={(e) => updateContent("title", e.target.value)}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Văn bản cột trái 1</label>
                <textarea
                  defaultValue={data.leftText1}
                  onBlur={(e) => updateContent("leftText1", e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Văn bản cột trái 2</label>
                <textarea
                  defaultValue={data.leftText2}
                  onBlur={(e) => updateContent("leftText2", e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light"
                />
             </div>
          </div>
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Văn bản cột phải 1</label>
                <textarea
                  defaultValue={data.rightText1}
                  onBlur={(e) => updateContent("rightText1", e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Văn bản cột phải 2 (Chữ ký/Slogan)</label>
                <textarea
                  defaultValue={data.rightText2}
                  onBlur={(e) => updateContent("rightText2", e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light italic"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionsPageManager = ({ data }: any) => {
  const updateContent = async (field: string, value: any) => {
    try {
      await setDoc(doc(db, "cms", "collections_page"), { [field]: value }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "cms/collections_page");
    }
  };

  if (!data) {
    return (
      <div className="bg-zinc-900/50 p-12 rounded-3xl border border-white/5 text-center max-w-lg mx-auto">
        <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-white">Chưa có nội dung Trang Bộ sưu tập</h3>
        <button
          onClick={() => updateContent("hero_title", "BỘ SƯU TẬP")}
          className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
        >
          Khởi tạo ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">Quản lý Trang Bộ sưu tập</h2>
        <p className="text-zinc-500 text-xs font-light tracking-wide">Thay đổi nội dung text và hình ảnh trên toàn bộ trang Bộ sưu tập.</p>
      </div>

      <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5 space-y-12">
        {/* Section: Hero */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold border-b border-white/5 pb-2">1. Hero Section</h3>
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Tiêu đề chính (Hero Title)</label>
                <input
                  defaultValue={data.hero_title}
                  onBlur={(e) => updateContent("hero_title", e.target.value)}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light text-white"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Ảnh Hero</label>
                <ImageUploader 
                  value={data.hero_image} 
                  onUpload={(url) => updateContent("hero_image", url)}
                  folder="collections"
                />
             </div>
          </div>
        </section>

        {/* Section: Explore */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold border-b border-white/5 pb-2">2. Explore Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Tiêu đề Explore</label>
                <input
                  defaultValue={data.explore_title}
                  onBlur={(e) => updateContent("explore_title", e.target.value)}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light text-white"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Mô tả Explore</label>
                <input
                  defaultValue={data.explore_description}
                  onBlur={(e) => updateContent("explore_description", e.target.value)}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light text-white"
                />
             </div>
          </div>
        </section>

        {/* Section: Material Research */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold border-b border-white/5 pb-2">3. Nghiên cứu Vật liệu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Tiêu đề</label>
                <input
                  defaultValue={data.research_title}
                  onBlur={(e) => updateContent("research_title", e.target.value)}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light text-white"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Mô tả</label>
                <input
                  defaultValue={data.research_description}
                  onBlur={(e) => updateContent("research_description", e.target.value)}
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light text-white"
                />
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProductsPageManager = ({ data }: any) => {
  const updateContent = async (field: string, value: any) => {
    try {
      await setDoc(doc(db, "cms", "products_page"), { [field]: value }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "cms/products_page");
    }
  };

  if (!data) {
    return (
      <div className="bg-zinc-900/50 p-12 rounded-3xl border border-white/5 text-center max-w-lg mx-auto">
        <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-white">Chưa có nội dung Trang Sản phẩm</h3>
        <button
          onClick={() => updateContent("hero_title", "DANH SÁCH SẢN PHẨM")}
          className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
        >
          Khởi tạo ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">Quản lý Trang Sản phẩm</h2>
        <p className="text-zinc-500 text-xs font-light tracking-wide">Thay đổi nội dung hero banner trên trang danh sách sản phẩm.</p>
      </div>

      <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5 space-y-12">
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold border-b border-white/5 pb-2">Hero Section</h3>
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Tiêu đề chính</label>
                <input
                  defaultValue={data.hero_title}
                  onBlur={(e) => updateContent("hero_title", e.target.value)}
                  placeholder="DANH SÁCH SẢN PHẨM"
                  className="w-full bg-zinc-800/50 px-5 py-3 rounded-xl border border-white/5 outline-none focus:border-white transition-all text-sm font-light text-white"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Ảnh Hero</label>
                <ImageUploader 
                  value={data.hero_image} 
                  onUpload={(url) => updateContent("hero_image", url)}
                  folder="products_page"
                />
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;

const CompanyContentManager = ({ data }: any) => {
  const updateContent = async (field: string, value: string) => {
    try {
      await setDoc(doc(db, "cms", "company_page"), { [field]: value }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "cms/company_page");
    }
  };

  if (!data) return (
     <div className="bg-zinc-900/50 p-12 rounded-3xl border border-white/5 text-center max-w-lg mx-auto">
        <button
          onClick={() => updateContent("hero_title", "Về Tân Gia Huy")}
          className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs"
        >
          Khởi tạo nội dung trang
        </button>
     </div>
  );

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">Về Tân Gia Huy</h2>
      <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5 space-y-8">
        {[
          { id: "hero_title", label: "Hero Title", type: "text" },
          { id: "hero_image", label: "Hero Image", type: "image" },
          { id: "intro_vocation_text", label: "Intro Vocation Text", type: "textarea" },
          { id: "intro_design_activity_text", label: "Intro Design Activity Text", type: "textarea" },
          { id: "intro_cta1", label: "Intro CTA 1 Text", type: "text" },
          { id: "intro_cta2", label: "Intro CTA 2 Text", type: "text" },
          { id: "section1_title", label: "Section 1 Title", type: "text" },
          { id: "section1_description", label: "Section 1 Description", type: "textarea" },
          { id: "section1_image", label: "Section 1 Image", type: "image" },
          { id: "section2_title", label: "Section 2 Title", type: "text" },
          { id: "section2_description", label: "Section 2 Description", type: "textarea" },
          { id: "section2_image", label: "Section 2 Image", type: "image" },
          { id: "video_placeholder_image", label: "Video Placeholder", type: "image" },
        ].map((field) => (
          <div key={field.id} className="space-y-3">
             <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{field.label}</label>
             {field.type === 'text' && <input defaultValue={data[field.id]} onBlur={(e) => updateContent(field.id, e.target.value)} className="w-full bg-zinc-800/50 px-6 py-4 rounded-xl border border-white/5 outline-none"/>}
             {field.type === 'textarea' && <textarea defaultValue={data[field.id]} onBlur={(e) => updateContent(field.id, e.target.value)} className="w-full bg-zinc-800/50 px-6 py-4 rounded-xl border border-white/5 outline-none" rows={4}/>}
             {field.type === 'image' && <ImageUploader value={data[field.id]} onUpload={(url) => updateContent(field.id, url)} />}
          </div>
        ))}
      </div>
    </div>
  );
};
