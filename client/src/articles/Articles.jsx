import React, { useState, useEffect } from 'react';

import ArticleService from "_services/articles.service"

import AudioPlayer from '_components/AudioPlayer';

export function Article() {
  const [viewMode, setViewMode] = useState('list');
  const [articleIndex, setArticleIndex] = useState(null);
  const [newArticleName, setNewArticleName] = useState('');
  const [newArticleDescription, setNewArticleDescription] = useState('');
  const [cards, setCards] = useState([]);
  const [language, setLanguage] = useState("hi");
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [translatedCards, settranslatedCards] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [openAddCardModal, setOpenAddCardModal] = useState(false)
  const [openDeleteCardModal, setOpenDeleteCardModal] = useState(false)
  const [newCardValue, setNewCardValue] = useState( '' )

  const handleViewArticle = async (index) => {
    const articleResponse = await ArticleService.articleGet(articles[index].id)
    console.log(articleResponse)
    setCardIndex(0)
    if(articleResponse.status === 200){
      setCards(articleResponse.data.cards)
      const cardResponse = await ArticleService.cardGetAlllang(articleResponse.data.cards[0].id)
      console.log(cardResponse.data.trans)
      settranslatedCards(cardResponse.data.trans)
      // console.log(cardResponse.data.trans.find(
      //   (card)=>card.lang === language
      // ))

      setArticleIndex(index);
      setViewMode('view');
    }

    // setArticleIndex(index);
    // setViewMode('view');
  };

  const handleCreateArticle = () => {
    setNewArticleName("")
    setNewArticleDescription("")
    setCards([])
    setViewMode('create');
  };

  const handleAddCard = () => {
    setCards([...cards, {cardValue:''}]);
  };

  const handleLanguageSelect = (e) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = async () => {
    // Handle form submission
    const response = await ArticleService.articlePost(
      newArticleName,
      newArticleDescription,
      cards
    )
    console.log(response)
    setViewMode('list');
  };

  const handlePreviousArticle = async () => {
    // Handle navigation to previous card
    if(cardIndex > 0){
      const cardResponse = await ArticleService.cardGetAlllang(cards[cardIndex-1].id)
      console.log(cardResponse.data.trans)
      settranslatedCards(cardResponse.data.trans)
      setCardIndex(cardIndex-1)
    }
  };

  const handleNextArticle = async () => {
    // Handle navigation to next card
    if(cardIndex < cards.length-1){
      const cardResponse = await ArticleService.cardGetAlllang(cards[cardIndex+1].id)
      console.log(cardResponse.data.trans)
      settranslatedCards(cardResponse.data.trans)
      setCardIndex(cardIndex+1)
    }
  };

  const handlePlay = (translatedText) => {
    // Handle playing translated text
  };

  const handleAddNewCard = async () => {
    // Handle adding new card to article
    const response = ArticleService.cardPost([{
      cardValue: newCardValue,
    }], articles[articleIndex].id)
    console.log(response)
    setOpenAddCardModal(false)
    setNewCardValue("")
  }

  const handleDeleteCard = async () => {
    const response = await ArticleService.cardDelete(cards[cardIndex].id)
    console.log(response)
    setOpenDeleteCardModal(false)
    setCards(
      cards.filter((card, index) => index !== cardIndex)
    )
    setCardIndex(0)
  }

  const dummyTranslatedText = 'This is the translated text.';

  useEffect(()=>{
    ArticleService.articleGetAll().then(
      (response)=>{
        setArticles(response.data)
        console.log(response.data)
        setLoading(false)
      },
      (error)=>{
        console.log(error)
      }
    )
  },[viewMode])

  return (
    <>{
      loading?(<>Loading...</>):(
        <>
          <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Articles</h1>
              {viewMode === 'create' || (viewMode === 'view' && articleIndex !== null) ? (
                <nav className="text-sm">
                  <span className="text-gray-500"
                  onClick={
                    ()=>{
                      setViewMode('list');
                      setArticleIndex(null);
                    }
                  }
                  >Articles</span> /{' '}
                  <span className="text-blue-500">
                    {viewMode === 'create' ? 'Create' : 'View'}
                  </span>
                </nav>
              ) : null}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleCreateArticle}
              >
                Create New Article
              </button>
            </div>

            {viewMode === 'list' && (
              <div className="grid grid-cols-1 gap-4">
                {/* List of articles */}
                {articles.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-md p-4 shadow cursor-pointer"
                    onClick={() => {
                      setArticleIndex(index)
                      handleViewArticle(index)
                    }}
                  >
                    <h2 className="text-lg font-bold">{article.ArticleName}</h2>
                    <p>{article.description}</p>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2"
                      onClick={() => {
                        setArticleIndex(index)
                        handleViewArticle(index)
                      }}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'create' && (
              <div className="bg-white rounded-md p-4 shadow">
                <h2 className="text-lg font-bold">Create New Article</h2>
                <div className="mt-4">
                  <label className="block">Article Name</label>
                  <input
                    value={newArticleName}
                    onChange={(e) => setNewArticleName(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                </div>
                <div className="mt-4">
                  <label className="block">Article Description</label>
                  <textarea
                    value={newArticleDescription}
                    onChange={(e) => setNewArticleDescription(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full"
                    rows="4"
                  ></textarea>
                </div>
                <div className="mt-4">
                  <button
                    onClick={()=>{
                      handleAddCard()
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Add a Card
                  </button>
                  {cards.map((card, index) => (
                    <div key={index} className="mt-4 relative">
                      <label className="block">Card Text {index + 1}</label>
                      <textarea
                        value={card.cardValue}
                        onChange={(e) => {
                          const updatedCards = [...cards];
                          updatedCards[index].cardValue = e.target.value;
                          setCards(updatedCards);
                        }}
                        className="border border-gray-300 p-2 rounded-md w-full"
                        rows="4"
                      ></textarea>
                      <button
                        className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                        onClick={() => {
                          const updatedCards = [...cards];
                          updatedCards.splice(index, 1);
                          setCards(updatedCards);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            )}


            {viewMode === 'view' && articleIndex !== null && (
              <div className="bg-white rounded-md p-4 shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">{articles[articleIndex].ArticleName}</h2>
                  <div>
                    <button onClick={()=>{
                      setOpenAddCardModal(true)
                    }} className="bg-blue-500 text-white rounded-md px-4 py-2">Add Card</button>
                    {openAddCardModal && <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                      <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                              <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                  <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Add new Card to Article</h3>
                                  <div className="mt-2">
                                    <textarea
                                      value={newCardValue}
                                      onChange={(e) => setNewCardValue(e.target.value)}
                                      className="border border-gray-300 p-2 rounded-md w-full"
                                      rows="4"
                                      placeholder='Enter card data'
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button onClick={()=>{
                                handleAddNewCard()
                                handleViewArticle(articleIndex)
                                }} type="button" className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 mx-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset bg-sky-400 hover:bg-sky-200 sm:mt-0 sm:w-auto">Add Card</button>
                              <button type="button" onClick={()=>{
                                setOpenAddCardModal(false)
                              }} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}
                    <button onClick={()=>{
                      setOpenDeleteCardModal(true)
                    }} className="bg-red-500 text-white rounded-md px-4 py-2 ml-2">Delete Card</button>
                    {openDeleteCardModal && <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                      <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                              <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                  </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                  <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Delete Card</h3>
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-500">Are you sure you want to delete this card? All of your data for the card will be permanently removed. This action cannot be undone.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button onClick={()=>{handleAddNewCard()}} type="button" className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 mx-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset bg-red-500 hover:bg-red-300 sm:mt-0 sm:w-auto">Delete Card</button>
                              <button type="button" onClick={()=>{
                                setOpenDeleteCardModal(false)
                              }} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}
                  </div>
                </div>


                
                <div className="flex items-center justify-between mt-4">
                  <h3 className="text-xl">Article Description</h3>
                  <select
                    value={language}
                    onChange={handleLanguageSelect}
                    className="border border-gray-300 p-2 rounded-md w-40"
                  >
                    <option value="hi">Hindi</option>
                    <option value="te">Telugu</option>
                    <option value="bn">Bengali</option>
                  </select>
                </div>
                <p>{articles[articleIndex].description}</p>
                <div className="mt-4">
                  <div className="bg-gray-100 p-4 rounded-md">
                    <h3 className="text-lg font-bold">Card Text</h3>
                    <p>{cards[cardIndex].cardValue}</p>
                    <h3 className="text-lg font-bold mt-4">Translated Text</h3>
                    <p>{translatedCards.find((card) => card.lang === language)
                      ?.convertedText
                    }</p>
                    <h3 className="text-lg font-bold mt-4">Pronounced Text</h3>
                    <p>{translatedCards.find((card) => card.lang === language)
                      ?.pronouncedText
                    }</p>
                  </div>
                </div>
                {/* <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
                  onClick={() => handlePlay(dummyTranslatedText)}
                >
                  Play
                </button> */}
                <div className="mt-4">
                  <label className="block">Audio Pronounciation</label>
                  {
                    translatedCards ? (
                      <AudioPlayer
                        file_url={translatedCards.find((card) => card.lang === language)
                          ?.audio_link
                        }
                      />
                    ):(<></>)
                  }
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={handlePreviousArticle}
                    disabled={cardIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={handleNextArticle}
                    disabled={cardIndex === cards.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )
    }</>
  );
}
