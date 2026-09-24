import React, { useEffect, useState } from 'react';
import { ExternalLink, LogIn, LogOut, Music2, Search, X } from 'lucide-react';
import { spotifyHandleCallback, spotifyHasToken, spotifyIsConfigured, spotifyLogin, spotifyLogout, spotifySearch, spotifyTrackEmbedUrl } from '../services/spotifyApi';

export default function SpotifyPlayer() {
  const [connected, setConnected] = useState(spotifyHasToken());
  const [query, setQuery] = useState('lofi focus');
  const [results, setResults] = useState({ tracks: { items: [] }, playlists: { items: [] } });
  const [embedUrl, setEmbedUrl] = useState('https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0');
  const [manualUrl, setManualUrl] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const tracks = Array.isArray(results?.tracks?.items) ? results.tracks.items.filter(Boolean) : [];
  const playlists = Array.isArray(results?.playlists?.items) ? results.playlists.items.filter(Boolean) : [];

  useEffect(() => { spotifyHandleCallback().then((token) => { if (token) setConnected(true); }).catch((error) => setMessage(error.message)); }, []);

  const connect = async () => { try { await spotifyLogin(); } catch (error) { setMessage(error.message); } };
  const search = async (event) => {
    event.preventDefault(); if (!query.trim()) return; setBusy(true); setMessage('');
    try { setResults(await spotifySearch(query.trim())); } catch (error) { setMessage(error.message); setConnected(spotifyHasToken()); } finally { setBusy(false); }
  };
  const useUrl = (event) => { event.preventDefault(); const url = spotifyTrackEmbedUrl(manualUrl); if (!url) { setMessage('Paste a Spotify track, album, or playlist link.'); return; } setEmbedUrl(url); setManualUrl(''); setMessage(''); };

  return (
    <div className="glass-card p-6 border border-slate-200 dark:border-indigo-950/20 lg:col-span-3">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div><span className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 flex items-center gap-2"><Music2 size={14} className="text-emerald-500" /> Spotify focus player</span><p className="text-xs text-slate-500 leading-relaxed mt-2">Play a focus playlist alongside your Pomodoro timer.</p></div>
        {connected ? <button onClick={() => { spotifyLogout(); setConnected(false); setResults({ tracks: { items: [] }, playlists: { items: [] } }); }} className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1"><LogOut size={13} /> Disconnect</button> : <button onClick={connect} disabled={!spotifyIsConfigured()} className="text-xs btn-primary px-3 py-2 flex items-center gap-1 disabled:opacity-50"><LogIn size={13} /> Connect Spotify</button>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] gap-5">
        <div>
          {connected && <form onSubmit={search} className="flex gap-2 mb-3"><div className="flex-1 flex items-center gap-2 px-3 rounded-xl border border-slate-200 dark:border-surface-500/30 bg-white/50 dark:bg-surface-700/30"><Search size={14} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full py-2.5 bg-transparent text-xs focus:outline-none" placeholder="Search Spotify" /></div><button className="px-3 rounded-xl border border-slate-200 dark:border-surface-500/30 text-xs font-bold" disabled={busy}>{busy ? '...' : 'Search'}</button></form>}
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {tracks.map((track) => <button key={track.id} onClick={() => setEmbedUrl(spotifyTrackEmbedUrl(track.external_urls?.spotify || ''))} className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-500/10 transition-colors"><img src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url} alt="" className="w-10 h-10 rounded-lg object-cover" /><span className="min-w-0"><span className="block text-xs font-bold truncate">{track.name || 'Spotify track'}</span><span className="block text-[10px] text-slate-500 truncate">{(track.artists || []).map((artist) => artist.name).join(', ')}</span></span></button>)}
            {playlists.map((playlist) => <button key={playlist.id} onClick={() => setEmbedUrl(spotifyTrackEmbedUrl(playlist.external_urls?.spotify || ''))} className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-500/10 transition-colors"><img src={playlist.images?.[0]?.url} alt="" className="w-10 h-10 rounded-lg object-cover" /><span className="text-xs font-bold truncate">{playlist.name || 'Spotify playlist'}</span></button>)}
          </div>
          {!spotifyIsConfigured() && <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-3">Add <code>VITE_SPOTIFY_CLIENT_ID</code> to enable Spotify search, or paste a link below.</p>}
          {message && <p className="text-[10px] text-rose-500 mt-3">{message}</p>}
        </div>
        <div><form onSubmit={useUrl} className="flex gap-2 mb-3"><input value={manualUrl} onChange={(event) => setManualUrl(event.target.value)} className="min-w-0 flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-surface-500/30 bg-white/50 dark:bg-surface-700/30 text-xs focus:outline-none" placeholder="Paste Spotify link" /><button className="px-3 rounded-xl border border-slate-200 dark:border-surface-500/30 text-xs font-bold" aria-label="Use Spotify link"><X size={14} /></button></form><iframe title="Spotify focus player" src={embedUrl} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-xl" /><a href={embedUrl.replace('/embed', '')} target="_blank" rel="noreferrer" className="mt-2 text-[10px] text-slate-500 hover:text-emerald-500 flex items-center justify-end gap-1">Open in Spotify <ExternalLink size={11} /></a></div>
      </div>
    </div>
  );
}
