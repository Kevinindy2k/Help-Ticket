import { useState, useEffect, Fragment } from "react";
import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  HeartIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";

import useTranslation from "next-translate/useTranslation";

import ListUserFiles from "../components/ListUserFiles";
import { useRouter } from "next/router";
import moment from "moment";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const { data: session } = useSession();

  const router = useRouter();

  const [hour, setHour] = useState();
  const [openTickets, setOpenTickets] = useState(0);
  const [completedTickets, setCompletedTickets] = useState(0);
  const [unassigned, setUnassigned] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState();

  const { t } = useTranslation("helpticket");

  let file = [];

  async function time() {
    const date = new Date();
    const hour = date.getHours();
    setHour(hour);
  }

  async function getOpenTickets() {
    await fetch(`/api/v1/data/count/open-tickets`, {
      method: "get",
      headers: {
        ContentType: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setOpenTickets(res.result);
      });
  }

  async function getCompletedTickets() {
    await fetch(`/api/v1/data/count/completed-tickets`, {
      method: "get",
      headers: {
        ContentType: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setCompletedTickets(res.result);
      });
  }

  async function fetchTickets() {
    await fetch(`/api/v1/ticket/open`, {
      method: "get",
      headers: {
        ContentType: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setTickets(res.tickets);
      });
  }

  const stats = [
    { name: t("open_tickets"), stat: openTickets, href: "/tickets" },
    {
      name: t("completed_tickets"),
      stat: completedTickets,
      href: "/tickets?filter=closed",
    },
  ];

  async function datafetch() {
    fetchTickets();
    getOpenTickets();
    getCompletedTickets();
    await setLoading(false);
  }

  useEffect(() => {
    time();
    datafetch();
  }, []);

  return (
    <div className="flex flex-col xl:flex-row min-h-[85vh]">
      <div className="w-full xl:w-[80%]">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 sm:px-6 lg:w-full lg:mx-auto lg:px-8">
            <div className="py-1 md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                {/* Profile */}
                <div className="flex items-center">
                  <span className="hidden sm:inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-500">
                    <span className="text-lg font-medium leading-none text-white uppercase">
                      {session.user.name[0]}
                    </span>
                  </span>
                  <div>
                    <div className="flex items-center">
                      <span className="pt-4 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        {session.user.name}
                      </span>
                    </div>
                    <dl className="flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                      <dt className="sr-only">{t("account_status")}</dt>
                      <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                        <CheckCircleIcon
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                          aria-hidden="true"
                        />
                        {session.user.isAdmin ? "Admin" : "user"}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!loading && (
          <>
            <div>
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                  <Link href={item.href}>
                    <div
                      key={item.name}
                      className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
                    >
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {item.stat}
                      </dd>
                    </div>
                  </Link>
                ))}
              </dl>
            </div>

            <div className="flex w-full flex-col ">
              <span className="font-bold text-2xl">Ticket List</span>
              <div className="-mx-5 sm:-mx-0 w-full">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        Status
                      </th>

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Last Update
                      </th>

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Assigned
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {tickets !== undefined &&
                      tickets.slice(0, 10).map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-300 hover:cursor-pointer"
                          onClick={() => router.push(`/tickets/${item.id}`)}
                        >
                          <td className="w-full sm:max-w-[280px] 2xl:max-w-[720px] truncate py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {item.title}
                          </td>
                          <td className="hidden px-3 py-1 text-sm text-gray-500 lg:table-cell w-[64px]">
                            {/* rejected */}
                            {item.status === "rejected" && (
                              <span className="inline-flex w-full justify-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                {item.status}
                              </span>
                            )}
                            {item.status === "resolved" && (
                              <span className="inline-flex items-center w-full justify-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {item.status}
                              </span>
                            )}
                            {item.status === "accepted" && (
                              <span className="inline-flex items-center w-full justify-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                {item.status}
                              </span>
                            )}

                            {item.status === "pending" && (
                              <span className="inline-flex items-center w-full justify-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                {item.status}
                              </span>
                            )}
                          </td>

                          <td className="px-3 py-1 text-sm text-gray-500 w-[160px]">
                            {moment(item.createdAt).format("DD-MM-YYYY")}
                          </td>
                          <td className="px-3 py-1 text-sm text-gray-500 w-[64px]">
                            {item.assignedTo ? item.assignedTo.name : "n/a"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
