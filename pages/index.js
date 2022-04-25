import Head from 'next/head';
import Image from 'next/image';
import {useForm} from 'react-hook-form';
import {useEffect, useState} from 'react';
import classNames from 'classnames';

import PolarNodeManager from '../classes/PolarNodeManager';
import defaultNodeParams from '../data/defaultNodeParams.json';
import accurateRoundNumber from '../lib/accurateRoundNumber';

const manager = new PolarNodeManager(2.50, defaultNodeParams); //TODO get POLAR price

export default function Home() {

  const [nodes, setNodes] = useState([]);
  const [totals, setTotals] = useState({
    count: 0,
    cost: 0,
    totalPreRoiPolar: 0,
    totalPreRoiUSD: 0,
    totalPostRoiPolar: 0,
    totalPostRoiUSD: 0,
  });

  const {register, handleSubmit, setValue} = useForm();

  const updateNodesState = () => {
    const nodes = manager.getNodes();
    setNodes(nodes);
  }

  const handleCountChange = (event, id) => {
    manager.setNodeCount(id, parseInt(event.target.value));
    updateNodesState();
  };

  const handlePriceChange = (event) => {
    manager.setPolarPrice(parseFloat(event.target.value));
    updateNodesState();
  }

  const handleResetCounts = () => {
    manager.setAllNodeCounts(0);
    resetFormFields();
    updateNodesState();
  }

  const resetFormFields = () => nodes.forEach(n => setValue(n.name, 0));

  const onSubmit = data => null;

  useEffect(() => {
    manager.setAllNodeCounts(1);
    updateNodesState();
    nodes.map((n) => register(n.name));
  }, []);

  useEffect(() => {
    const totals = manager.getTotals();
    setTotals(totals);
  }, [nodes]);

  const styles = {
    NameHeaderCell: "py-2.5 pl-4 pr-3 text-left text-sm font-bold sm:pl-6 md:pl-0 bg-cyan-700 text-white drop-shadow-lg leading-3",
    StatHeaderCell: "py-2.5 px-3 text-sm font-bold bg-cyan-500 text-white drop-shadow-lg leading-3",
    NameFooterCell: "py-3 pl-4 pr-3 text-left text-md font-bold sm:pl-6 md:pl-0 bg-cyan-700 text-white drop-shadow-lg leading-3",
    StatFooterCell: "py-3 px-3 text-md font-bold bg-cyan-700 text-white drop-shadow-lg leading-3",
    NameCell: (isDiamond, isEmerald, isOlympus) => classNames({
      "text-left whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium sm:pl-6 md:pl-0 font-semibold ": true,
      "bg-cyan-500 text-white": isDiamond,
      "bg-emerald-500 text-white": isEmerald,
      "bg-orange-500 text-white border-t-2 border-gray-500": isOlympus,
      "bg-gray-100 text-gray-600 border-t-2 border-gray-400": !isEmerald && !isDiamond && !isOlympus
    }),
    StatCell: (isDiamond, isEmerald, isOlympus) => classNames({
      "whitespace-nowrap py-2 px-3 text-sm text-black font-semibold": true,
      "bg-cyan-200 text-cyan-800": isDiamond,
      "bg-emerald-200 text-emerald-800": isEmerald,
      "bg-orange-200 text-orange-800 border-t-2 border-gray-400": isOlympus,
      "bg-gray-50 text-gray-800 border-t-2 border-gray-400": !isEmerald && !isDiamond && !isOlympus
    })
  };

  return (
    <div className="flex flex-col justify-center bg-cyan-600">
      <div className="mt-4 mb-6 flex flex-col mx-auto">
        <Head>
          <title>POLAR Rewards Calculator by ThisIsRuddy</title>
          <meta name="description"
                content="A quick react app built for calculating POLAR nodes rewards made by ThisIsRuddy! :)"/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <header className="flex flex-row mb-2">
          <div className="grow my-auto">
            <div className="flex flex-row">
              <div className="mr-4">
                <div className="w-20 h-20 mb-1">
                  <Image src="/polar_logo_v3.svg" width={100} height={100}/>
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">POLAR Nodes Reward Calculator</h2>
                <p className="text-white font-semibold mb-4 max-w-xl leading-4">
                  I&apos;ve built this calculator for everyone so we can all do some quick maths and also have a quick
                  reference 😁</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="rounded-full overflow-hidden w-20 h-20 mb-1 drop-shadow-lg">
              <Image src="/thisisruddy.png" width={100} height={100}/>
            </div>
            <p className="text-white font-semibold mb-4 text-center leading-3">
              <span className="text-sm">Made by</span>
              <br/>
              ThisIsRuddy!😁</p>
          </div>
        </header>

        {nodes &&
          <main>

            <section className="flex flex-row justify-center mb-2">
              <div className="mr-4">
                <div className="flex flex-row mb-1">
                  <h2 className="text-3xl font-bold text-white m2-4 drop-shadow-lg">POLAR Price $</h2>
                  <input
                    className="ml-2 w-24 rounded-xl overflow-hidden text-center font-bold text-xl text-cyan-700 drop-shadow-lg pr-1"
                    name="polarPrice"
                    onChange={e => handlePriceChange(e)}
                    defaultValue="2.44" type="number"/>
                </div>
                <p className="text-white font-semibold mb-4 leading-4 drop-shadow-lg max-w-xl">
                  Change the POLAR price above to see what your daily rewards could be if POLAR was a different price.
                </p>
              </div>
              <div>
                <div className="flex flex-row mb-1">
                  <h2 className="text-3xl font-bold text-white m2-4 drop-shadow-lg">Reset Counts</h2>
                  <button className="ml-2 font-bold rounded-xl bg-white px-6 py-1 text-xl text-cyan-700 drop-shadow-lg"
                          onClick={() => handleResetCounts()}
                  >
                    Reset
                  </button>
                </div>
                <p className="text-white font-semibold mb-4 leading-4 drop-shadow-lg max-w-xl">
                  This handy button should reset all the node counts back 0 to save you some hassle.
                </p>
              </div>
            </section>

            <section className="overflow-x-auto drop-shadow-lg mb-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <table
                  className="min-w-full divide-y divide-gray-300 text-center rounded overflow-hidden">
                  <thead>
                  <tr>
                    <th scope="col" className={styles.NameHeaderCell}>
                      <span className="pl-4">Name</span>
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-sky-600 border-l-2 border-gray-400"}>
                      Node<br/>Count
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-sky-600"}>
                      Cost<br/>POLAR
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-sky-600"}>
                      Reward<br/>POLAR
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-indigo-500 border-l-2 border-gray-400"}>
                      ROI<br/>%
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-indigo-500"}>
                      ROI<br/>Days
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-orange-600 border-l-2 border-gray-400"}>
                      Pre ROI<br/>Tax
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-orange-600"}>
                      Pre ROI<br/>
                      POLAR
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-orange-600"}>
                      Pre ROI<br/>
                      $
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-green-600 border-l-2 border-gray-400"}>
                      Post ROI<br/>Tax
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-green-600"}>
                      Post ROI<br/>
                      POLAR
                    </th>
                    <th scope="col" className={styles.StatHeaderCell + " bg-green-600"}>
                      Post ROI<br/>
                      $
                    </th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {nodes.map((n) => {
                      const count = accurateRoundNumber(n.count);
                      const cost = accurateRoundNumber(n.cost);
                      const reward = accurateRoundNumber(n.reward);
                      const roiPercent = accurateRoundNumber(n.roiPercentage);
                      const roiDays = accurateRoundNumber(n.roiDays);
                      const preTax = accurateRoundNumber(n.preRoiTax);
                      const dailyPre = accurateRoundNumber(n.totalPreRoiPolar);
                      const dailyPreUSD = accurateRoundNumber(n.totalPreRoiUSD);
                      const postTax = accurateRoundNumber(n.postRoiTax);
                      const dailyPost = accurateRoundNumber(n.totalPostRoiPolar);
                      const dailyPostUSD = accurateRoundNumber(n.totalPostRoiUSD);

                      const isDiamond = n.isDiamond;
                      const isEmerald = n.isEmerald;
                      const isOlympus = n.isOlympus;

                      return (
                        <tr key={n.name}>
                          <td className={styles.NameCell(isDiamond, isEmerald, isOlympus)}>
                            <span className="pl-4">{n.name}</span>
                          </td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus) + " border-l-2 border-gray-400"}>
                            <div className="rounded overflow-hidden">
                              <input className="w-10 overflow-hidden text-center font-bold" name={n.name}
                                     onChange={e => handleCountChange(e, n.id)} value={count}
                                     type="number"/>
                            </div>
                          </td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus)}>{cost}</td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus)}>{reward}</td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus) + " border-l-2 border-gray-400"}>{roiPercent}%</td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus)}>{roiDays}</td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus) + " border-l-2 border-gray-400"}>{preTax}%</td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus)}>{dailyPre}</td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus)}>
                            <div className="flex flex-row justify-between">
                              <div>$</div>
                              <div>{dailyPreUSD.toFixed(2)}</div>
                            </div>
                          </td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus) + " border-l-2 border-gray-400"}>{postTax}%</td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus)}>{dailyPost}</td>
                          <td className={styles.StatCell(isDiamond, isEmerald, isOlympus)}>
                            <div className="flex flex-row justify-between">
                              <div>$</div>
                              <div>{dailyPostUSD.toFixed(2)}</div>
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  )}
                  </tbody>
                  <tfoot>
                  <tr>
                    <th scope="col" className={styles.NameFooterCell}>
                      <p className="text-right pl-4">Totals</p>
                    </th>
                    <th scope="col" className={styles.StatFooterCell + " bg-sky-600 border-l-2 border-gray-400"}>
                      {totals.count}
                    </th>
                    <th scope="col" className={styles.StatFooterCell + " bg-sky-600"}>
                      {totals.cost}
                    </th>
                    <th scope="col" className={styles.StatFooterCell + " bg-sky-600"}>
                      {totals.reward.toFixed(2)}
                    </th>
                    <th scope="col" className={styles.StatFooterCell + " bg-indigo-500 border-l-2 border-gray-400"}/>
                    <th scope="col" className={styles.StatFooterCell + " bg-indigo-500"}/>
                    <th scope="col" className={styles.StatFooterCell + " bg-orange-600 border-l-2 border-gray-400"}/>
                    <th scope="col" className={styles.StatFooterCell + " bg-orange-600"}>
                      {accurateRoundNumber(totals.totalPreRoiPolar)}
                    </th>
                    <th scope="col" className={styles.StatFooterCell + " bg-orange-600"}>
                      <div className="flex flex-row justify-between">
                        <div>$</div>
                        <div>{totals.totalPreRoiUSD.toFixed(2)}</div>
                      </div>
                    </th>
                    <th scope="col" className={styles.StatFooterCell + " bg-green-600 border-l-2 border-gray-400"}/>
                    <th scope="col" className={styles.StatFooterCell + " bg-green-600"}>
                      {accurateRoundNumber(totals.totalPostRoiPolar)}
                    </th>
                    <th scope="col" className={styles.StatFooterCell + " bg-green-600"}>
                      <div className="flex flex-row justify-between">
                        <div>$</div>
                        <div>{totals.totalPostRoiUSD.toFixed(2)}</div>
                      </div>
                    </th>
                  </tr>
                  </tfoot>
                </table>
              </form>
            </section>

          </main>
        }

        <footer className="mt-4">
          <p className="font-bold text-white text-center drop-shadow-lg">
            Made by ThisIsRuddy, find me in the Polar Discord with the rest of the POLAR Fam and say hi! 😁
          </p>
        </footer>
      </div>
    </div>
  )
}
