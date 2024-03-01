/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { secondsFormatter } from "../utils"
import { useState, useEffect } from 'react'
import { RiPinDistanceFill } from "react-icons/ri";
import { MdAccessTime } from "react-icons/md";

export default function Details(props) {

    const [benzinpreis, setBenzinpreis] = useState(1.87);
    const distanz = 1000
    const [anzahlPersonen, setAnzahlPersonen] = useState(1);
    const [gesamtkosten, setGesamtkosten] = useState(0);
    const [durchschnittVerbrauch, setdurchschnittVerbrauch] = useState(6.7);


    const berechneKosten = () => {
        if (props.details.length > 0 && props.details[0].distance !== undefined) {
            const kosten = (((props.details[0].distance / 1000).toFixed(0) * durchschnittVerbrauch) / 100) * benzinpreis;
            setGesamtkosten(kosten / anzahlPersonen);
        }
    };

    useEffect(() => {

        berechneKosten()




    }, [benzinpreis, anzahlPersonen, durchschnittVerbrauch, props.details])

    return (
        <div className='p-6 bg-opacity-90 text-white m-10 rounded-xl bg-gray-800'>
            <div>
                <h3 className="text-4xl font-bold mb-5">Details</h3>
                {props.details.length > 0 && props.details[0].distance !== undefined &&

                    (
                        <div>
                            <div className="flex justify-between my-5">
                                <div className="flex items-center">
                                    <RiPinDistanceFill size={30} />
                                    <h5 className="text-2xl ml-4">{props.details.length != 0 && ((props.details[0].distance) / 1000).toFixed(0)} Km</h5>
                                </div>
                                <div className="flex items-center">
                                    <MdAccessTime size={30} />
                                    <h5 className="text-2xl ml-4">{secondsFormatter(props.details[0].duration)} Stunden</h5>
                                </div>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-xl">Benzinpreisrechner</h2>
                                <div className="flex justify-between items-center">
                                    <label className="text-xl">
                                        Benzinpreis pro Liter (€):
                                    </label>
                                    <input
                                        className='rounded-lg p-3 m-2 w-56 text-black'
                                        type="number"
                                        value={benzinpreis}
                                        onChange={e => setBenzinpreis(e.target.valueAsNumber)}
                                    />

                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-xl">
                                        durchschnittlicher Verbrauch (Liter):
                                    </label>
                                    <input
                                        className='rounded-lg p-3 m-2 w-56 text-black'
                                        type="number"
                                        value={durchschnittVerbrauch}
                                        onChange={e => setdurchschnittVerbrauch(e.target.valueAsNumber)}
                                    />

                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="text-xl">
                                        Anzahl Personen:
                                    </label>
                                    <select value={anzahlPersonen} className='rounded-lg p-3 m-2 w-56 text-black' onChange={e => setAnzahlPersonen(e.target.value)}>

                                        {[1, 2, 3, 4, 5].map(num => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xl flex justify-end mt-5">Preis pro Person: </p>
                                    <p className="text-xl flex justify-end mt-5"><strong> {gesamtkosten.toFixed(2)}€</strong></p>
                                </div>

                            </div>
                        </div>


                    )
                }

            </div>
        </div>
    )
}