/* eslint-disable react/prop-types */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaDeleteLeft } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react'


export default function LocationList(props) {

    const [currentLocation, setCurrentLocation] = useState([
        { id: uuidv4(), name: 'Trier' },
        { id: uuidv4(), name: 'Berlin' },
    ]);

    const deletePoint = (id) => {
        //setPoints(points.filter(point => point.id !== id));
        setCurrentLocation(currentLocation.filter(point => point.id !== id))
        props.setPoints(props.points.filter(point => point.id !== id))
    };


    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const newPoints = Array.from(props.points);

        const [reorderedItem] = newPoints.splice(result.source.index, 1);
        newPoints.splice(result.destination.index, 0, reorderedItem);
        props.setPoints(newPoints)
        setCurrentLocation(newPoints)
    };


    const addPoint = (index) => {
        const newPoints = [...currentLocation];
        newPoints.splice(index + 1, 0, { id: uuidv4(), name: '' });
        //setPoints(newPoints);
        setCurrentLocation(newPoints)

    };


    const handleChange = (e, index) => {
        const newPoints = [...currentLocation];
        newPoints[index].name = e.target.value;
        setCurrentLocation(newPoints)
    };

    const handleBlur = (e, index) => {
        const newPoints = [...currentLocation];
        newPoints[index].name = e.target.value;
        props.setPoints(newPoints)
    };
    return (
        <div className=' p-6 bg-opacity-90  text-white m-10 rounded-xl bg-gray-800 '>
            <div>
                <div className='mb-3'>
                    <h3 className='font-bold text-xl'>
                        Roadtrip Planner
                    </h3>
                    <p>Plane und kalkuliere deine nächste Reise!</p>
                </div>

                <div className='text-black'>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="points">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {currentLocation.map((point, index) => (
                                        <Draggable key={point.id} draggableId={point.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    style={{ ...provided.draggableProps.style, marginBottom: '8px' }}
                                                    className='flex flex-col'
                                                >
                                                    <div className='flex  items-center'>
                                                        <input
                                                            className='rounded-lg p-3 m-2 w-56'
                                                            type="text"
                                                            value={currentLocation[index].name}

                                                            onChange={(e) => handleChange(e, index)}
                                                            placeholder="Suche nach einem Ort..."
                                                            onBlur={(e) => handleBlur(e, index)}
                                                        />


                                                        {
                                                            currentLocation.length > 2 && (<div className=' cursor-pointer bg-transparent text-white text-xl' onClick={() => deletePoint(point.id)} style={{ marginLeft: '10px' }}><FaDeleteLeft />
                                                            </div>)
                                                        }
                                                        {
                                                            props.points.length > 1 && (<span className='text-white text-xl mx-5' {...provided.dragHandleProps}>☰</span>)
                                                        }

                                                    </div>
                                                    <div className='p-1 rounded-xl text-center cursor-pointer m-2 bg-opacity-10 bg-white text-white' onClick={() => addPoint(index)}>+</div>

                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

            </div>

        </div>
    )
}