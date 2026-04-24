"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
  isDarkTheme?: boolean;
}

export default function VoiceInput({ onTranscriptionComplete, isDarkTheme }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        await handleAudioUpload(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure you have granted permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      // Also stop all tracks to release the mic light in browser
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAudioUpload = async (blob: Blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.text) {
        onTranscriptionComplete(data.text);
      } else {
        alert("Could not understand audio. Please try again.");
      }
    } catch (e) {
      alert("Network error. Please check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      type="button"
      className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border transition-all text-sm font-bold ${
        isRecording 
          ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" 
          : isProcessing 
            ? "bg-brand-gold/10 border-brand-gold/50 text-brand-gold"
            : "bg-[#1a1311] border-brand-gold/30 text-brand-text hover:bg-brand-gold/10 hover:border-brand-gold"
      }`}
    >
      {isProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
      ) : isRecording ? (
        <Square className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4 text-brand-text-muted" />
      )}
      {isProcessing ? "Processing..." : isRecording ? "Stop Recording" : "Voice Input"}
    </button>
  );
}
