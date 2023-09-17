import cv2
from gaze_tracking_model.gaze_tracking import GazeTracking
from dash import Dash, dcc, html, Input, Output
from threading import Thread



# Global list to store gaze ratios
gaze_ratios = []
rate_of_change_horizontal = []
rate_of_change_vertical = []
total_rate_of_change_squared = []
cumulative_change_minute = []
cumulative_change_second = []

gaze = GazeTracking()
fps=30
webcam = cv2.VideoCapture(0)


window_name = "2D Gaze estimation"

width = 1920
height = 1080
cv2.namedWindow(window_name, cv2.WND_PROP_FULLSCREEN)
# cv2.setWindowProperty(window_name, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
cv2.resizeWindow('Gaze Estimation', width // 2, height)



    
# Initialize the Dash application
app = Dash(__name__)

# Dash layout to display multiple real-time graphs
app.layout = html.Div([
    dcc.Graph(id='live-graph-rate'),
    dcc.Graph(id='live-graph-minute'),
    dcc.Graph(id='live-graph-second'),
    dcc.Interval(
        id='interval-update',
        interval=1*1000,  # Update every 1 second
        n_intervals=0
    )
])

# Callback to update the graphs in real-time
@app.callback(
    [Output('live-graph-rate', 'figure'),
     Output('live-graph-minute', 'figure'),
     Output('live-graph-second', 'figure')],
    [Input('interval-update', 'n_intervals')]
)
def update_graph(n):
    if len(gaze_ratios) > 1:
        delta_horizontal = gaze_ratios[-1][0] - gaze_ratios[-2][0]
        delta_vertical = gaze_ratios[-1][1] - gaze_ratios[-2][1]
        delta_time = 1 / fps  # Assuming 30 FPS for now

        rate_of_change_horizontal.append(delta_horizontal / delta_time)
        rate_of_change_vertical.append(delta_vertical / delta_time)
        total_rate_of_change_squared.append((delta_horizontal / delta_time) ** 2 + (delta_vertical / delta_time) ** 2)

        # Calculate cumulative change for the last minute and last second
        cumulative_change_minute.append(sum(total_rate_of_change_squared[-int(fps * 60):]))
        cumulative_change_second.append(sum(total_rate_of_change_squared[-int(fps):]))

    time_axis = [i / fps for i in range(len(gaze_ratios))]
         

    # Graph for rate of change
    figure_rate = {
        'data': [
            {'x': time_axis[1:], 'y': rate_of_change_horizontal, 'type': 'line', 'name': 'Rate of Change - Horizontal'},
            {'x': time_axis[1:], 'y': rate_of_change_vertical, 'type': 'line', 'name': 'Rate of Change - Vertical'},
            {'x': time_axis[1:], 'y': total_rate_of_change_squared, 'type': 'line', 'name': 'Total Rate of Change Squared'}
        ],
        'layout': {'title': 'Rate of Change'}
    }

    # Graph for cumulative change in the last minute
    figure_minute = {
        'data': [
            {'x': time_axis[1:], 'y': cumulative_change_minute, 'type': 'line', 'name': 'Cumulative Change - Last Minute'}
        ],
        'layout': {'title': 'Cumulative Change - Last Minute'}
    }

    # Graph for cumulative change in the last second
    figure_second = {
        'data': [
            {'x': time_axis[1:], 'y': cumulative_change_second, 'type': 'line', 'name': 'Cumulative Change - Last Second'}
        ],
        'layout': {'title': 'Cumulative Change - Last Second'}
    }

    # update separate csv 
    with open('gaze_ratios.csv', 'w') as f:
        for item in gaze_ratios:
            f.write("%s\n" % str(item))


    return figure_rate, figure_minute, figure_second


# Code to run the Dash app in the background
def run_dash():
    app.run_server(debug=False, port=8050)


# Start the Dash app in a separate thread
dash_thread = Thread(target=run_dash)
dash_thread.start()

        

while True:
    _, frame = webcam.read()
    gaze.refresh(frame)

    new_frame = gaze.annotated_frame()
    text = ""

    # Get new gaze ratios
    cv2.imshow(window_name, frame)


    gaze.refresh(frame)
    new_frame = gaze.annotated_frame()


    try:

        horizontal_ratio = gaze.horizontal_ratio()
        vertical_ratio = gaze.vertical_ratio()

        # Store the gaze ratios in the global list
        if horizontal_ratio is not None and vertical_ratio is not None:
            gaze_ratios.append((horizontal_ratio, vertical_ratio))

        text = f'Horiz: {horizontal_ratio:.2f}, Vert: {vertical_ratio:.2f}'
        color = (0, 255, 0)
        

    except:
        text = "Blinking/No eyes detected"
        color = (255,255,0)

    cv2.putText(new_frame, text, (20,  20), cv2.FONT_HERSHEY_DUPLEX, 1, color, 2)

    if(len(total_rate_of_change_squared) > 0 and not text == "Blinking/No eyes detected"):

        if(total_rate_of_change_squared[-1] > 10.00):
            cv2.putText(new_frame, "Extreme movement", (20,  50), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 255), 2)
        elif(total_rate_of_change_squared[-1] < 3.00):
            cv2.putText(new_frame, "Slow eye movement", (20,  50), cv2.FONT_HERSHEY_DUPLEX, 1, (255, 0, 0), 2)
    
    cv2.imshow(window_name, new_frame)


    if cv2.waitKey(1) == 27:    
        break