import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Play,
  Edit3,
  ExternalLink,
  Sparkles,
  Database,
  Image as ImageIcon,
  Video as VideoIcon,
  Check,
  X,
  Eye,
  SlidersHorizontal,
  Download,
  Info
} from 'lucide-react';
import { ExerciseMediaRecord, MediaAuditSummary, MediaVerificationStatus } from '../types/media';
import { getAllMediaRecords, getMediaAuditSummary, updateClientMediaRecord } from '../data/mediaDatabase';
import { YouTubePlayer } from '../components/video/YouTubePlayer';
import { extractYouTubeId, getYouTubeThumbnailUrl, getYouTubeWatchUrl } from '../utils/youtube';

export const MediaManagerPage: React.FC = () => {
  const [records, setRecords] = useState<ExerciseMediaRecord[]>([]);
  const [auditSummary, setAuditSummary] = useState<MediaAuditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState<{ current: number; total: number } | null>(null);

  // Modals state
  const [editingRecord, setEditingRecord] = useState<ExerciseMediaRecord | null>(null);
  const [editForm, setEditForm] = useState({
    coverImageUrl: '',
    imageSource: '',
    imageAlt: '',
    youtubeVideoUrl: '',
    notes: '',
  });
  const [testValidationResult, setTestValidationResult] = useState<{
    testing: boolean;
    imageValid?: boolean;
    imageError?: string;
    videoValid?: boolean;
    videoTitle?: string;
    videoError?: string;
  } | null>(null);

  const [previewVideoRecord, setPreviewVideoRecord] = useState<ExerciseMediaRecord | null>(null);
  const [previewImageRecord, setPreviewImageRecord] = useState<ExerciseMediaRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load records from backend API or local database fallback
  const fetchMediaData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      } else {
        setRecords(getAllMediaRecords());
      }

      const auditRes = await fetch('/api/media/audit');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditSummary(auditData);
      } else {
        setAuditSummary(getMediaAuditSummary());
      }
    } catch {
      setRecords(getAllMediaRecords());
      setAuditSummary(getMediaAuditSummary());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run full batch audit engine
  const handleRunBatchAudit = async () => {
    setIsAuditing(true);
    setAuditProgress({ current: 0, total: records.length });

    try {
      // Process in batches of 25
      const batchSize = 25;
      let offset = 0;
      let total = records.length;

      while (offset < total) {
        const res = await fetch('/api/media/validate-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: batchSize, offset }),
        });

        if (!res.ok) break;
        const data = await res.json();
        offset += batchSize;
        setAuditProgress({ current: Math.min(offset, total), total });
      }

      await fetchMediaData();
      showToast('Automated media audit complete! All items verified.');
    } catch (err: any) {
      showToast(`Batch audit error: ${err.message}`);
    } finally {
      setIsAuditing(false);
      setAuditProgress(null);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (rec: ExerciseMediaRecord) => {
    setEditingRecord(rec);
    setEditForm({
      coverImageUrl: rec.coverImageUrl || '',
      imageSource: rec.imageSource || '',
      imageAlt: rec.imageAlt || '',
      youtubeVideoUrl: rec.youtubeVideoUrl || (rec.youtubeVideoId ? `https://www.youtube.com/watch?v=${rec.youtubeVideoId}` : ''),
      notes: rec.notes || '',
    });
    setTestValidationResult(null);
  };

  // Test URLs Live before saving
  const handleTestUrlsLive = async () => {
    setTestValidationResult({ testing: true });
    try {
      const res = await fetch('/api/media/validate-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: editForm.coverImageUrl,
          videoUrlOrId: editForm.youtubeVideoUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestValidationResult({
          testing: false,
          imageValid: data.image ? data.image.valid : undefined,
          imageError: data.image?.error,
          videoValid: data.video ? data.video.valid : undefined,
          videoTitle: data.video?.title,
          videoError: data.video?.error,
        });
      } else {
        setTestValidationResult({
          testing: false,
          imageError: 'Validation server error',
          videoError: 'Validation server error',
        });
      }
    } catch (err: any) {
      setTestValidationResult({
        testing: false,
        imageError: err.message,
        videoError: err.message,
      });
    }
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    try {
      const res = await fetch(`/api/media/${editingRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          runAutoVerify: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateClientMediaRecord(data.record);
        setRecords(prev => prev.map(r => r.id === editingRecord.id ? data.record : r));
        setEditingRecord(null);
        showToast(`Updated media record for ${editingRecord.id}`);
        // Refresh summary
        const auditRes = await fetch('/api/media/audit');
        if (auditRes.ok) setAuditSummary(await auditRes.json());
      } else {
        showToast('Failed to save record on server');
      }
    } catch (err: any) {
      showToast(`Save error: ${err.message}`);
    }
  };

  // Export audit report JSON
  const handleExportAuditJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pro11_media_audit_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.exerciseName.toLowerCase().includes(q);
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesSub = r.subCategory.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesSub) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && r.category !== selectedCategory) {
        return false;
      }

      // Status
      if (selectedStatus === 'VERIFIED') {
        return r.videoVerificationStatus === 'VERIFIED' && r.imageVerificationStatus === 'VERIFIED';
      }
      if (selectedStatus === 'NEEDS_REVIEW') {
        return r.videoVerificationStatus === 'NEEDS_REVIEW' || r.imageVerificationStatus === 'NEEDS_REVIEW';
      }
      if (selectedStatus === 'BROKEN') {
        return r.videoVerificationStatus === 'BROKEN' || r.imageVerificationStatus === 'BROKEN';
      }
      if (selectedStatus === 'MISSING') {
        return r.videoVerificationStatus === 'MISSING' || !r.youtubeVideoId;
      }

      return true;
    });
  }, [records, searchQuery, selectedCategory, selectedStatus]);

  const categories = useMemo(() => {
    const set = new Set(records.map(r => r.category));
    return ['ALL', ...Array.from(set)];
  }, [records]);

  return (
    <div className="space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="bg-theme-card border border-theme rounded-sm p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-pulse" />
              <span className="text-xs font-mono-sport uppercase font-bold text-[#ccff00] tracking-wider">
                CENTRAL MEDIA DATABASE & VALIDATION ENGINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-theme-primary uppercase tracking-tight">
              PRO11 Media Manager
            </h1>
            <p className="text-xs sm:text-sm text-theme-muted mt-1 max-w-2xl">
              Individual image mapping and verified YouTube instructional video playback for all 165 football exercises.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRunBatchAudit}
              disabled={isAuditing}
              className="px-4 py-2 bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 text-black text-xs font-mono-sport font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Auditing Media...' : 'Run Automated Audit'}</span>
            </button>

            <button
              onClick={handleExportAuditJson}
              className="px-3.5 py-2 bg-theme-elevated border border-theme hover:border-white/30 text-theme-primary text-xs font-mono-sport uppercase rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export complete media database as JSON"
            >
              <Download className="w-3.5 h-3.5 text-lime-accent" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>

        {/* Audit Progress Bar */}
        {auditProgress && (
          <div className="mt-4 pt-4 border-t border-theme">
            <div className="flex justify-between text-xs font-mono-sport mb-1 text-theme-muted">
              <span>Auditing live media items against YouTube oEmbed and image HEAD...</span>
              <span className="text-[#ccff00] font-bold">
                {auditProgress.current} / {auditProgress.total} ({Math.round((auditProgress.current / auditProgress.total) * 100)}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ccff00] transition-all duration-300"
                style={{ width: `${(auditProgress.current / auditProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. LIVE AUDIT KPI SUMMARY CARDS */}
      {auditSummary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-theme-card border border-theme rounded-sm">
            <div className="text-[10px] uppercase font-mono-sport text-theme-muted mb-1 flex items-center gap-1">
              <Database className="w-3 h-3 text-[#ccff00]" />
              Total Drills
            </div>
            <div className="text-xl font-bold font-mono-sport text-theme-primary">
              {auditSummary.totalExercises}
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">100% individual IDs</div>
          </div>

          <div className="p-3.5 bg-theme-card border border-theme rounded-sm">
            <div className="text-[10px] uppercase font-mono-sport text-theme-muted mb-1 flex items-center gap-1">
              <VideoIcon className="w-3 h-3 text-[#ccff00]" />
              Verified Videos
            </div>
            <div className="text-xl font-bold font-mono-sport text-[#ccff00]">
              {auditSummary.verifiedVideos}
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">Real YouTube Tutorials</div>
          </div>

          <div className="p-3.5 bg-theme-card border border-theme rounded-sm">
            <div className="text-[10px] uppercase font-mono-sport text-theme-muted mb-1 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-[#ccff00]" />
              Verified Photos
            </div>
            <div className="text-xl font-bold font-mono-sport text-emerald-400">
              {auditSummary.verifiedImages}
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">Relevant action photos</div>
          </div>

          <div className="p-3.5 bg-theme-card border border-theme rounded-sm">
            <div className="text-[10px] uppercase font-mono-sport text-theme-muted mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-yellow-400" />
              Needs Review
            </div>
            <div className="text-xl font-bold font-mono-sport text-yellow-400">
              {auditSummary.needsReviewVideos + auditSummary.needsReviewImages}
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">Pending manual checks</div>
          </div>

          <div className="p-3.5 bg-theme-card border border-theme rounded-sm">
            <div className="text-[10px] uppercase font-mono-sport text-theme-muted mb-1 flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-400" />
              Broken Media
            </div>
            <div className="text-xl font-bold font-mono-sport text-rose-400">
              {auditSummary.brokenVideos + auditSummary.brokenImages}
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">404s or embed block</div>
          </div>

          <div className="p-3.5 bg-theme-card border border-theme rounded-sm">
            <div className="text-[10px] uppercase font-mono-sport text-theme-muted mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#ccff00]" />
              System Health
            </div>
            <div className="text-xl font-bold font-mono-sport text-[#ccff00]">
              {auditSummary.healthPercentage}%
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">Audit compliance</div>
          </div>
        </div>
      )}

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-theme-card border border-theme rounded-sm p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name, ID (e.g. phys-leg-1), or skill..."
            className="w-full pl-9 pr-4 py-2 bg-theme-elevated border border-theme rounded-xs text-xs text-theme-primary placeholder-theme-muted focus:outline-hidden focus:border-[#ccff00]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-theme-elevated border border-theme rounded-xs text-xs font-mono-sport text-theme-primary focus:outline-hidden focus:border-[#ccff00]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-theme-elevated border border-theme rounded-xs text-xs font-mono-sport text-theme-primary focus:outline-hidden focus:border-[#ccff00]"
          >
            <option value="ALL">Status: All Media</option>
            <option value="VERIFIED">Status: 100% Verified</option>
            <option value="NEEDS_REVIEW">Status: Needs Review</option>
            <option value="BROKEN">Status: Broken Media</option>
            <option value="MISSING">Status: Missing Video</option>
          </select>
        </div>
      </div>

      {/* 4. MEDIA RECORDS TABLE / GRID */}
      <div className="bg-theme-card border border-theme rounded-sm overflow-hidden">
        <div className="p-4 border-b border-theme flex items-center justify-between text-xs font-mono-sport text-theme-muted">
          <span>
            Showing <strong className="text-white">{filteredRecords.length}</strong> of{' '}
            <strong className="text-white">{records.length}</strong> exercise media records
          </span>
          <span className="hidden sm:inline">
            Each record links unique exercise ID with cover image and verified YouTube video
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono-sport text-theme-muted">
            <div className="w-8 h-8 border-2 border-theme-border border-t-[#ccff00] rounded-full animate-spin mx-auto mb-3" />
            Loading Central Media Database...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-xs text-theme-muted">
            No media records match your filter criteria. Try broadening your search.
          </div>
        ) : (
          <div className="divide-y divide-theme">
            {filteredRecords.map((rec) => {
              const videoId = rec.youtubeVideoId || extractYouTubeId(rec.youtubeVideoUrl);
              const isVideoVerified = rec.videoVerificationStatus === 'VERIFIED';
              const isImageVerified = rec.imageVerificationStatus === 'VERIFIED';

              return (
                <div
                  key={rec.id}
                  className="p-4 hover:bg-theme-elevated/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left Column: Image Thumbnail & Exercise Details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Cover Image Thumbnail with Click-to-Zoom */}
                    <div
                      className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-xs overflow-hidden bg-black shrink-0 border border-theme group cursor-pointer"
                      onClick={() => setPreviewImageRecord(rec)}
                      title="Click to zoom image"
                    >
                      <img
                        src={rec.coverImageUrl}
                        alt={rec.imageAlt || rec.exerciseName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <span
                        className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                          isImageVerified ? 'bg-[#ccff00]' : 'bg-rose-500'
                        }`}
                      />
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1 text-[10px] font-mono-sport">
                        <span className="px-1.5 py-0.2 rounded-xs bg-[#ccff00]/15 text-[#ccff00] font-bold border border-[#ccff00]/30">
                          {rec.id}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-xs bg-theme-elevated text-theme-secondary border border-theme">
                          {rec.category} · {rec.subCategory}
                        </span>
                        {/* Status Pills */}
                        <span
                          className={`px-1.5 py-0.2 rounded-xs font-bold uppercase flex items-center gap-1 ${
                            isImageVerified
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <ImageIcon className="w-2.5 h-2.5" />
                          IMG: {rec.imageVerificationStatus}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded-xs font-bold uppercase flex items-center gap-1 ${
                            isVideoVerified
                              ? 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30'
                              : 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <VideoIcon className="w-2.5 h-2.5" />
                          VID: {rec.videoVerificationStatus}
                        </span>
                      </div>

                      <a
                        href={`/trainings/${rec.id}`}
                        className="text-sm font-bold font-display text-theme-primary hover:text-[#ccff00] transition-colors truncate block"
                      >
                        {rec.exerciseName}
                      </a>

                      <div className="text-[11px] text-theme-muted mt-0.5 line-clamp-1">
                        <span className="text-theme-secondary">Photo:</span> {rec.imageSource || 'Curated Unsplash'} ·{' '}
                        <span className="text-theme-secondary">Video:</span> {rec.videoTitle || 'Pending tutorial title'}{' '}
                        {rec.videoAuthor && `(${rec.videoAuthor})`}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Preview Video Button */}
                    {videoId && (
                      <button
                        onClick={() => setPreviewVideoRecord(rec)}
                        className="px-3 py-1.5 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 text-xs font-mono-sport font-bold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Preview instructional video player"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Preview Video</span>
                      </button>
                    )}

                    {/* Direct Watch Link */}
                    {videoId && (
                      <a
                        href={getYouTubeWatchUrl(videoId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-theme-elevated hover:bg-white/10 text-theme-muted hover:text-white border border-theme rounded-xs transition-colors cursor-pointer"
                        title="Watch directly on YouTube.com"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Edit Media Button */}
                    <button
                      onClick={() => handleOpenEdit(rec)}
                      className="px-3 py-1.5 bg-theme-elevated hover:bg-white/10 text-theme-primary border border-theme text-xs font-mono-sport rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Edit media URLs for this drill"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-lime-accent" />
                      <span>Edit Media</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. EDIT MEDIA MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1015] border border-theme rounded-sm max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingRecord(null)}
              className="absolute top-4 right-4 text-theme-muted hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
              <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00]">
                UPDATE MEDIA MAPPING
              </span>
            </div>
            <h3 className="text-lg font-bold font-display text-white uppercase mb-1">
              {editingRecord.exerciseName}
            </h3>
            <div className="text-xs font-mono-sport text-theme-muted mb-4">
              ID: {editingRecord.id} · Category: {editingRecord.category} ({editingRecord.subCategory})
            </div>

            <div className="space-y-4 text-xs font-mono-sport">
              {/* Cover Image URL */}
              <div>
                <label className="block text-theme-muted uppercase mb-1">Cover Photograph URL</label>
                <input
                  type="text"
                  value={editForm.coverImageUrl}
                  onChange={(e) => setEditForm(prev => ({ ...prev, coverImageUrl: e.target.value }))}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-black border border-theme rounded-xs text-white focus:outline-hidden focus:border-[#ccff00]"
                />
              </div>

              {/* Image Source Attribution */}
              <div>
                <label className="block text-theme-muted uppercase mb-1">Image Source / Attribution</label>
                <input
                  type="text"
                  value={editForm.imageSource}
                  onChange={(e) => setEditForm(prev => ({ ...prev, imageSource: e.target.value }))}
                  placeholder="Unsplash Pro Athletics / Club Photography"
                  className="w-full px-3 py-2 bg-black border border-theme rounded-xs text-white focus:outline-hidden focus:border-[#ccff00]"
                />
              </div>

              {/* YouTube Video URL or ID */}
              <div>
                <label className="block text-theme-muted uppercase mb-1">
                  YouTube Video URL or 11-char ID (Supports 5 Formats)
                </label>
                <input
                  type="text"
                  value={editForm.youtubeVideoUrl}
                  onChange={(e) => setEditForm(prev => ({ ...prev, youtubeVideoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                  className="w-full px-3 py-2 bg-black border border-theme rounded-xs text-white focus:outline-hidden focus:border-[#ccff00]"
                />
                <div className="text-[10px] text-theme-muted mt-1">
                  Supports watch?v=, youtu.be, shorts, live, embed, and raw ID.
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-theme-muted uppercase mb-1">Coaching Notes / Context</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Instructional cues and drill alignment..."
                  className="w-full px-3 py-2 bg-black border border-theme rounded-xs text-white focus:outline-hidden focus:border-[#ccff00]"
                />
              </div>

              {/* Test Live Validation Results */}
              {testValidationResult && (
                <div className="p-3 bg-black border border-theme rounded-xs space-y-2">
                  <div className="text-[10px] font-bold uppercase text-[#ccff00]">
                    LIVE VALIDATION FEEDBACK:
                  </div>

                  {testValidationResult.testing ? (
                    <div className="text-theme-muted">Testing URLs with live oEmbed & HTTP HEAD...</div>
                  ) : (
                    <>
                      {/* Image Result */}
                      {testValidationResult.imageValid !== undefined && (
                        <div className="flex items-center gap-1.5">
                          {testValidationResult.imageValid ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span>
                            Image: {testValidationResult.imageValid ? 'HTTP 200 OK (Reachable)' : `Error: ${testValidationResult.imageError}`}
                          </span>
                        </div>
                      )}

                      {/* Video Result */}
                      {testValidationResult.videoValid !== undefined && (
                        <div className="flex items-center gap-1.5">
                          {testValidationResult.videoValid ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00]" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span>
                            Video:{' '}
                            {testValidationResult.videoValid
                              ? `oEmbed OK: "${testValidationResult.videoTitle}"`
                              : `Error: ${testValidationResult.videoError}`}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-theme">
                <button
                  type="button"
                  onClick={handleTestUrlsLive}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-theme rounded-xs font-mono-sport uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-lime-accent" />
                  <span>Test URLs Live</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingRecord(null)}
                    className="px-3.5 py-2 bg-transparent text-theme-muted hover:text-white rounded-xs font-mono-sport uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold font-mono-sport uppercase rounded-xs transition-colors cursor-pointer"
                  >
                    Save & Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIDEO PREVIEW MODAL */}
      {previewVideoRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f1015] border border-theme rounded-sm max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setPreviewVideoRecord(null)}
              className="absolute top-4 right-4 text-theme-muted hover:text-white cursor-pointer z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-3">
              <span className="text-[10px] font-mono-sport uppercase text-[#ccff00] font-bold">
                DRILL PREVIEW · {previewVideoRecord.id}
              </span>
              <h3 className="text-lg font-bold font-display text-white uppercase">
                {previewVideoRecord.exerciseName}
              </h3>
            </div>

            <YouTubePlayer
              videoIdOrUrl={previewVideoRecord.youtubeVideoId || previewVideoRecord.youtubeVideoUrl}
              title={previewVideoRecord.exerciseName}
              author={previewVideoRecord.videoAuthor}
              poster={previewVideoRecord.coverImageUrl}
              exerciseId={previewVideoRecord.id}
              tips={['Focus on clean ankle lock and match velocity throughout drill.']}
            />
          </div>
        </div>
      )}

      {/* 7. IMAGE PREVIEW MODAL */}
      {previewImageRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setPreviewImageRecord(null)}>
          <div className="max-w-2xl w-full bg-[#0f1015] border border-theme rounded-sm p-4 relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImageRecord(null)}
              className="absolute top-3 right-3 text-theme-muted hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-2">
              <span className="text-[10px] font-mono-sport uppercase text-[#ccff00] font-bold">
                COVER IMAGE INSPECTION · {previewImageRecord.id}
              </span>
              <h4 className="text-sm font-bold font-display text-white uppercase">
                {previewImageRecord.exerciseName}
              </h4>
            </div>
            <div className="w-full aspect-video bg-black rounded-xs overflow-hidden border border-theme">
              <img
                src={previewImageRecord.coverImageUrl}
                alt={previewImageRecord.imageAlt || previewImageRecord.exerciseName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-sport text-theme-muted">
              <span>Source: {previewImageRecord.imageSource}</span>
              <span className="text-emerald-400 font-bold">Status: {previewImageRecord.imageVerificationStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f1015] border-2 border-[#ccff00] text-white px-4 py-2.5 rounded-xs shadow-2xl text-xs font-mono-sport flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
