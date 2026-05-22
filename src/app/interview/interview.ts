import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { project } from '../project/project';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, project],
  templateUrl: './interview.html',
  styleUrls: ['./interview.css']
})
export class Interview implements OnInit, OnDestroy {
  activeTab: 'desc' | 'cases' | 'board' = 'desc';
  timeLeftString: string = '45:00';
  tabFocusInfractions: number = 0;
  isWhiteboardActive: boolean = false;
  chatMessages: string[] = [];

  // Camera Tracking Hooks
  isCameraOn: boolean = false;
  private localMediaStream: MediaStream | null = null;
  private totalSecondsRemaining: number = 2700;
  private timerIntervalId: any;

  ngOnInit(): void {
    this.startSessionCountdown();
  }

  ngOnDestroy(): void {
    this.stopCameraStream();
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }
  }

  /**
   * Core Pillar 1: WebRTC Device Pipeline Hardware Instantiation
   * Triggers the real camera feed on user click click
   */
  async toggleCandidateCamera(videoElement: HTMLVideoElement): Promise<void> {
    if (this.isCameraOn) {
      this.stopCameraStream();
      videoElement.srcObject = null;
      return;
    }

    try {
      // Direct integration with HTML5 browser hardware capture
      this.localMediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, frameRate: 24 },
        audio: false // Kept false to avoid feedback echo loops during local testing
      });

      // Pass the hardware stream reference directly into the video source element
      videoElement.srcObject = this.localMediaStream;
      this.isCameraOn = true;
    } catch (err) {
      console.error('Webcam permission denied or unavailable:', err);
      alert('Could not access camera. Please check your browser hardware permissions.');
    }
  }

  /**
   * Releases hardware threads cleanly when the component unmounts
   */
  private stopCameraStream(): void {
    if (this.localMediaStream) {
      this.localMediaStream.getTracks().forEach(track => track.stop());
      this.localMediaStream = null;
    }
    this.isCameraOn = false;
  }

  onWindowBlur(): void {
    this.tabFocusInfractions++;
  }

  sendChatMessage(inputElement: HTMLInputElement): void {
    const text = inputElement.value.trim();
    if (text) {
      this.chatMessages.push(text);
      inputElement.value = '';
    }
  }

  drawMockLine(): void {
    this.isWhiteboardActive = true;
  }

  private startSessionCountdown(): void {
    this.timerIntervalId = setInterval(() => {
      if (this.totalSecondsRemaining <= 0) {
        clearInterval(this.timerIntervalId);
        return;
      }
      this.totalSecondsRemaining--;
      const minutes = Math.floor(this.totalSecondsRemaining / 60);
      const seconds = this.totalSecondsRemaining % 60;
      this.timeLeftString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
  }
}
