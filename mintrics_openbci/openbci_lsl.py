from pyOpenBCI import OpenBCICyton
from pylsl import StreamInfo, StreamOutlet
import numpy as np

SCALE_FACTOR_EEG = (4500000)/24/(2**23-1) #uV/count
SCALE_FACTOR_AUX = 0.002 / (2**4)

print("Creating LSL stream for EEG. \nName: OpenBCIEEG\nID: OpenBCItestEEG\n")

info_eeg = StreamInfo('obci_eeg1', 'EEG', 8, 1, 'float32', 'OpenBCItestEEG')

print("Creating LSL stream for AUX. \nName: OpenBCIAUX\nID: OpenBCItestEEG\n")

info_aux = StreamInfo('obci_eeg2', 'EEG', 3, 250, 'float32', 'OpenBCItestAUX')

outlet_eeg = StreamOutlet(info_eeg)
outlet_aux = StreamOutlet(info_aux)

def lsl_streamers(sample):
    outlet_eeg.push_sample(np.array(sample.channels_data)*SCALE_FACTOR_EEG)
    outlet_aux.push_sample(np.array(sample.aux_data)*SCALE_FACTOR_AUX)

board = OpenBCICyton(port='COM3', daisy=False)

board.start_stream(lsl_streamers)