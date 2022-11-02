import React, { Form, InputGroup, Button, Table } from 'react-bootstrap';
import PageLayout from '../components/pageLayout';
import CgLogUploader from '../components/cglogUploader';
import { useEffect, useRef, useState } from 'react';

const FreeSearch = () => {
  const [data, setData] = useState(null);
  const [searchType, setSearchType] = useState('normal');
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const searchTextInputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchText) {
      return;
    }

    const result = [];
    for (const item of data) {
      for (const line of item.data) {
        if (searchType === 'normal') {
          line.includes(searchText) &&
            result.push({ file: item.file, text: line });
        }

        if (searchType === 'regex') {
          new RegExp(searchText).test(line) &&
            result.push({ file: item.file, text: line });
        }
      }
    }

    setSearchResult(result);
  };

  useEffect(() => {
    data && data.length && searchTextInputRef.current.focus();
  }, [data]);

  return (
    <PageLayout title="自定義檢索">
      <CgLogUploader
        onLoaded={(result) => {
          setData(result);
          setSearchResult(null);
        }}
      />
      {(() => {
        if (data) {
          if (data.length) {
            return (
              <Form className="mt-5" onSubmit={handleSearch}>
                <Form.Group>
                  <Form.Label>檢索文字</Form.Label>
                  <InputGroup>
                    <InputGroup.Radio
                      id="r1"
                      name="r"
                      value="normal"
                      checked={searchType === 'normal'}
                      onChange={() => {
                        setSearchType('normal');
                      }}
                    />
                    <InputGroup.Text as="label" htmlFor="r1">
                      一般檢索
                    </InputGroup.Text>
                    <InputGroup.Radio
                      id="r2"
                      name="r"
                      value="regex"
                      checked={searchType === 'regex'}
                      onChange={() => {
                        setSearchType('regex');
                      }}
                    />
                    <InputGroup.Text as="label" htmlFor="r2">
                      Regular Expression
                    </InputGroup.Text>
                    <Form.Control
                      ref={searchTextInputRef}
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                      }}
                    />
                    <Button variant="outline-secondary" type="submit">
                      檢索
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>
            );
          } else {
            return '查無資料...';
          }
        }
      })()}
      {searchResult && (
        <div className="mt-5">
          <p>共查詢到 {searchResult.length} 筆資料</p>
          <Table>
            <thead>
              <tr>
                <td>檔案</td>
                <td>訊息</td>
              </tr>
            </thead>
            <tbody>
              {searchResult.map((l, index) => (
                <tr key={index}>
                  <td>{l.file}</td>
                  <td>{l.text}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </PageLayout>
  );
};

export default FreeSearch;
