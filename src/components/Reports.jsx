import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CogIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '../config/constants';

export default function Reports() {
  const [credentials, setCredentials] = useState({
    bot_token: '',
    chat_id: ''
  });
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const savedCredentials = localStorage.getItem('telegramCredentials');
    if (savedCredentials) {
      setCredentials(JSON.parse(savedCredentials));
    }
  }, []);


  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const saveCredentials = (newCredentials) => {
    localStorage.setItem('telegramCredentials', JSON.stringify(newCredentials));
    setCredentials(newCredentials);
    setIsOpen(false);
    showNotification('Your Telegram credentials have been saved.');
  };

  const sendReport = useMutation({
    mutationFn: async () => {
      const response = await fetch(ENDPOINTS.sendReport, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials: credentials.bot_token && credentials.chat_id ? credentials : undefined,
          limit: 20
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send report');
      }
      return response.json();
    },
    onSuccess: () => {
      showNotification('The meme report has been sent to Telegram.');
    },
    onError: (error) => {
      showNotification(error.message, 'error');
    },
  });

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
          notification.type === 'error' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Reports</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-500 hover:bg-gray-50"
          >
            <CogIcon className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-500">
            Generate and send reports of top memes to your Telegram channel.
            {!credentials.bot_token && !credentials.chat_id && (
              <span className="block mt-2 text-yellow-600">
                ⚠️ No Telegram credentials set. Report will be sent to default bot. Click the settings icon to add your bot credentials.
              </span>
            )}
          </p>
          
          <button
            onClick={() => sendReport.mutate()}
            disabled={sendReport.isPending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="w-4 h-4 mr-2" />
            {sendReport.isPending ? 'Sending...' : 'Send Report'}
          </button>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title 
                    as="h3" 
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    Telegram Settings
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </Dialog.Title>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      saveCredentials({
                        bot_token: formData.get('bot_token'),
                        chat_id: formData.get('chat_id')
                      });
                    }}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <label htmlFor="bot_token" className="block text-sm font-medium text-gray-700">
                        Bot Token
                      </label>
                      <input
                        type="text"
                        id="bot_token"
                        name="bot_token"
                        defaultValue={credentials.bot_token}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter your Telegram bot token"
                      />
                    </div>
                    <div>
                      <label htmlFor="chat_id" className="block text-sm font-medium text-gray-700">
                        Chat ID
                      </label>
                      <input
                        type="text"
                        id="chat_id"
                        name="chat_id"
                        defaultValue={credentials.chat_id}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter your Telegram chat ID"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Settings
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Instructions</h3>
        <div className="space-y-3 text-sm text-gray-500">
          <p>To set up Telegram reporting:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create a Telegram bot via @BotFather</li>
            <li>Send /newbot command in BotFather and follow instructions</li>
            <li>Copy the bot token provided</li>
            <li>Search for @userinfobot in Telegram and start a chat to get your chat ID</li>
            <li>Configure these credentials using the settings icon above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}