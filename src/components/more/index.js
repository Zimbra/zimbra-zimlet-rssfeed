import { createElement, Component, render } from 'preact';
import { compose } from 'recompose';
import { withIntl } from '../../enhancers';
import { ModalDialog } from '@zimbra-client/components';
import { useContext } from 'preact/hooks';
import {  IntlContext } from 'preact-i18n';
import dompurify from 'dompurify';
import { FetchRequest } from './fetchrequest';

function createMore(props, context) {
   const { intl } = useContext(IntlContext)
   const zimletStrings = intl.dictionary['zimbra-zimlet-rssfeed'];

   const handleClick = (e) => {
      let modal = (
         <ModalDialog
            title={zimletStrings.title}
            cancelButton={true}
            onClose={handleClose}
            onAction={handleOKClick}
         >
            <div>{zimletStrings.modalText}<br /><br /><b>{zimletStrings.name}:</b><br /><input type="text" id="RSSFeedName"></input><br /><br /><b>{zimletStrings.url}:</b><br /><input type="text" id="RSSFeedURL"></input><br />
            </div>
         </ModalDialog>
      );
      const { dispatch } = context.store;
      dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'RSSModal', modal: modal }));
   }

   const handleClose = () => {
      const { dispatch } = context.store;
      return dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'RSSModal' }));
   }

   const handleOKClick = () => {
      // from zm-modern-zimlets/zimlets/zimbra-zimlet-org-chart/src/api/fetchrequest.js
      FetchRequest.fetch(context.zimbraOrigin + '/service/soap/CreateFolderRequest', {
         method: 'POST',
         body: `{
            Body: {
               CreateFolderRequest: {
                  _jsns: 'urn:zimbraMail',
                  folder: {"l": "1","name": "${dompurify.sanitize(window.parent.document.getElementById('RSSFeedName').value)}","url": "${dompurify.sanitize(window.parent.document.getElementById('RSSFeedURL').value)}","view": "message"}
               }
            }
         }`
      }).then((response) => {
         if (response.ok == true) {
            toaster(zimletStrings.reload);
            handleClose();
         }
         else {
            toaster(zimletStrings.error);
         }
      });
   }

   const toaster = (text) => {
      const { dispatch } = context.store;
      dispatch(context.zimletRedux.actions.notifications.notify({
         message: text
      }));
   }

   if ((String(window.parent.location).endsWith("/modern/")) || (String(window.parent.location).endsWith("/modern")) || (String(window.parent.location).endsWith("/modern/#")) || (String(window.parent.location).indexOf("/modern/email/") > 0)) {
      return (
         <div>
            <a href="#" onClick={e => handleClick(props, context)}>{zimletStrings.title}</a>
         </div>
      );
   }
}

//By using compose from recompose we can apply internationalization to our Zimlet
//https://blog.logrocket.com/using-recompose-to-write-clean-higher-order-components-3019a6daf44c/
export default compose(
   withIntl()
)
   (
      createMore
   )
