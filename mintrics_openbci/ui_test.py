import sys
from IPython.display import clear_output

#from PyQt5.QtCore import Qt
#%matplotlib qt5
#%matplotlib inline
import io
import os
from pyqtgraph.Qt import QtGui, QtCore
import pyqtgraph as pg
import random
from pyOpenBCI import OpenBCICyton
import threading
import time
import numpy as np
from scipy import signal
from pyOpenBCI import OpenBCICyton
from PyQt5.QtGui import QPixmap
from PyQt5.QtWidgets import *
from brainflow.data_filter import DataFilter, FilterTypes, DetrendOperations
import requests
import json

SCALE_FACTOR = (4500000)/24/(2**23-1) #From the pyOpenBCI repo
colors = 'rgbycmwr'

# Set up GUI Layout
app = QtGui.QApplication([])
#app.setWindowIcon(QtGui.QIcon('logo.png'))
win = pg.GraphicsWindow(title='OpenBCI GUI')

ts_plots = [win.addPlot(row=i, col=0, colspan=2, title='Channel %d' % i, labels={'left': 'uV'}) for i in range(1,9)]
fft_plot = win.addPlot(row=1, col=2, rowspan=4, title='FFT Plot', labels={'left': 'uV', 'bottom': 'Hz'})
fft_plot.setLimits(xMin=1,xMax=60, yMin=0, yMax=1e7)
waves_plot = win.addPlot(row=5, col=2, rowspan=4, title='EEG Bands', labels={'left': 'uV', 'bottom': 'EEG Band'})
waves_plot.setLimits(xMin=0.5, xMax=5.5, yMin=0)
waves_xax = waves_plot.getAxis('bottom')
waves_xax.setTicks([list(zip(range(6), ('', 'Delta', 'Theta', 'Alpha', 'Beta', 'Gama')))])
data = [[0,0,0,0,0,0,0,0]]

# Define OpenBCI callback function
def save_data(sample):
    global data
    data.append([i*SCALE_FACTOR for i in sample.channels_data])

# Define function to update the graphs
def updater():
    global data, plots, colors
    t_data = np.array(data[-1250:]).T #transpose data
    fs = 250 #Hz

    # Notch Filter
    def notch_filter(val, data, fs=250):
        notch_freq_Hz = np.array([float(val)])
        for freq_Hz in np.nditer(notch_freq_Hz):
            bp_stop_Hz = freq_Hz + 3.0 * np.array([-1, 1])
            b, a = signal.butter(3, bp_stop_Hz / (fs / 2.0), 'bandstop')
            fin = data = signal.lfilter(b, a, data)
        return fin

    # Bandpass filter
    def bandpass(start, stop, data, fs = 250):
        bp_Hz = np.array([start, stop])
        b, a = signal.butter(5, bp_Hz / (fs / 2.0), btype='bandpass')
        return signal.lfilter(b, a, data, axis=0)

    # Applying the filters
    nf_data = [[],[],[],[],[],[],[],[]]
    bp_nf_data = [[],[],[],[],[],[],[],[]]

    for i in range(8):
        nf_data[i] = notch_filter(60, t_data[i])
        nf_data[i] = notch_filter(50, t_data[i])
        bp_nf_data[i] = bandpass(15, 60, nf_data[i])

    # Plot a time series of the raw data
    for j in range(8):
        ts_plots[j].clear()
        ts_plots[j].plot(pen=colors[j]).setData(t_data[j])

    # Get an FFT of the data and plot it
    sp = [[],[],[],[],[],[],[],[]]
    freq = [[],[],[],[],[],[],[],[]]
    
    fft_plot.clear()
    for k in range(8):
        sp[k] = np.absolute(np.fft.fft(bp_nf_data[k]))
        freq[k] = np.fft.fftfreq(bp_nf_data[k].shape[-1], 1.0/fs)
        fft_plot.plot(pen=colors[k]).setData(freq[k], sp[k])


    # Define EEG bands
    eeg_bands = {'Delta': (1, 4),
                 'Theta': (4, 8),
                 'Alpha': (8, 12),
                 'Beta': (12, 30),
                 'Gamma': (30, 45)}

    # Take the mean of the fft amplitude for each EEG band (Only consider first channel)
    eeg_band_fft = dict()
    sp_bands = np.absolute(np.fft.fft(t_data[1]))
    freq_bands = np.fft.fftfreq(t_data[1].shape[-1], 1.0/fs)

    for band in eeg_bands:
        freq_ix = np.where((freq_bands >= eeg_bands[band][0]) &
                           (freq_bands <= eeg_bands[band][1]))[0]
        eeg_band_fft[band] = np.mean(sp_bands[freq_ix])

    # Plot EEG Bands
    bg1 = pg.BarGraphItem(x=[1,2,3,4,5], height=[eeg_band_fft[band] for band in eeg_bands], width=0.6, brush='r')
    url_g = 'http://192.168.137.5:8327/status'
    mode_time = requests.get(url_g)
    
    #print("Alpha wave: "+str(eeg_band_fft['Alpha']))
    #print("Beta Wave: "+str(eeg_band_fft['Beta']))
    #print("Ratio Alpha/Beta: "+str(eeg_band_fft['Alpha']/eeg_band_fft['Beta']))
    
    if (eeg_band_fft['Alpha']/eeg_band_fft['Beta']>1.5):
        focussed='focussed'
        #print("Focussed")
    else:
        focussed='not_focussed'
        #print('Not Focussed')

    if mode_time.json()['pomodoro']['state']==0:
        url_b = 'http://192.168.137.5:8327/openbci'
        # Send the POST request with JSON data\
        json_1 = {'Delta':eeg_band_fft['Delta'],'Theta':eeg_band_fft['Theta'],'Alpha': eeg_band_fft['Alpha'], 'Beta': eeg_band_fft['Beta'],'Gamma':eeg_band_fft['Gamma'],'Focus Score':(eeg_band_fft['Alpha']/eeg_band_fft['Beta']),'focussed':focussed}
        print("You are: "+str(focussed))
        
        response = requests.post(url_b, json=json_1)
        #print(response)
        #fb_json =json.dumps({'Alpha':eeg_band_fft['Alpha'],'Beta':eeg_band_fft['Beta'],'Ratio':eeg_band_fft['Alpha']/eeg_band_fft['Beta'],'focussed':focussed})
        fb = open('openbci_data.txt','a+')
        fb.write(json.dumps(json_1)+'\n')
        fb.close()

    if mode_time.json()['pomodoro']['state']==1:
        url_b = 'http://192.168.137.5:8327/openbci'
        
        fb_send = open('openbci_data.txt','r')
        data_b = fb_send.readlines()
        json_data_b=[json.loads(line) for line in data_b]
        response_b = requests.post(url_b, json=json_data_b)
        
    waves_plot.clear()
    waves_plot.addItem(bg1)

# Define thread function
def start_board():
    board = OpenBCICyton(port='COM3', daisy=False)
    board.start_stream(save_data)
    
# Initialize Board and graphing update
if __name__ == '__main__':

    if os.path.exists("openbci_data.txt"):
        os.remove("openbci_data.txt")

    if (sys.flags.interactive != 1) or not hasattr(QtCore, 'PYQT_VERSION'):
        x = threading.Thread(target=start_board)
        x.daemon = True
        x.start()

        timer = QtCore.QTimer()
        timer.timeout.connect(updater)
        timer.start(0)
        QtGui.QApplication.instance().exec_()
        

board.disconnect()